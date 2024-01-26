import dataclasses

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.modflow.types.Project import ProjectId
from morpheus.settings import settings as app_settings


@dataclasses.dataclass(frozen=True)
class BaseModelRepositoryDocument:
    project_id: str
    base_model: dict
    hash: str
    previous_version: str
    changes_since: int
    is_latest: bool

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            base_model=obj['base_model'],
            hash=obj['hash'],
            previous_version=obj['previous_version'],
            changes_since=obj['changes_since'],
            is_latest=obj['is_latest'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_base_model(self) -> ModflowModel:
        return ModflowModel.from_dict(self.base_model)

    def with_updated_latest_base_model(self, base_model: ModflowModel):
        return dataclasses.replace(self, base_model=base_model.to_dict(), hash=base_model.get_hash(), changes_since=self.changes_since + 1, is_latest=True)

    def with_updated_version(self, version: str):
        return dataclasses.replace(self, previous_version=version, changes_since=0, is_latest=True)

    def with_latest_tag_disabled(self):
        return dataclasses.replace(self, is_latest=False)

    def with_latest_tag_enabled(self):
        return dataclasses.replace(self, is_latest=True)


class BaseModelRepository(RepositoryBase):

    def get_latest(self, project_id: ProjectId) -> ModflowModel:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'is_latest': True}, {'_id': 0})
        if data is None:
            raise Exception('Base Model does not exist')

        return BaseModelRepositoryDocument.from_dict(dict(data)).get_base_model()

    def save_non_existent_model(self, project_id: ProjectId, base_model: ModflowModel) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'is_latest': True})
        if data is not None:
            raise Exception('Latest base model already exists')

        document = BaseModelRepositoryDocument(
            project_id=project_id.to_str(),
            base_model=base_model.to_dict(),
            hash=base_model.get_hash(),
            previous_version='v0.0.0',
            changes_since=0,
            is_latest=True,
        )

        self.collection.insert_one(document.to_dict())

    def set_new_version(self, project_id: ProjectId, version: str) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'is_latest': True})
        if data is None:
            raise Exception('Latest base model does not exist')

        # get the latest document and set the new version
        document = BaseModelRepositoryDocument.from_dict(dict(data)).with_updated_version(version=version)

        # disable the latest tag for the old document
        self.collection.update_many(
            filter={'project_id': project_id.to_str(), 'is_latest': True},
            update={'$set': {'is_latest': False}},
        )

        self.collection.insert_one(document.to_dict())

    def update_latest(self, project_id: ProjectId, base_model: ModflowModel) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'is_latest': True})
        if data is None:
            raise Exception('Latest base model does not exist')

        document = BaseModelRepositoryDocument.from_dict(dict(data)).with_updated_latest_base_model(base_model=base_model)
        self.collection.replace_one(
            filter={'project_id': project_id.to_str(), 'is_latest': True},
            replacement=document.to_dict(),
        )

    def get_latest_base_model(self, project_id: ProjectId) -> BaseModelRepositoryDocument:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'is_latest': True}, {'_id': 0})
        if data is None:
            raise Exception('Base Model does not exist')

        return BaseModelRepositoryDocument.from_dict(dict(data))

    def switch_to_version(self, project_id: ProjectId, version: str) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'previous_version': version})
        if data is None:
            raise Exception(f'Base Model with version {version} does not exist')

        # remove documents with changes_since > 0
        self.collection.delete_many(
            filter={'project_id': project_id.to_str(), 'changes_since': {'$gt': 0}},
        )

        # disable the latest tag for the old document
        self.collection.update_many(
            filter={'project_id': project_id.to_str(), 'is_latest': True},
            update={'$set': {'is_latest': False}},
        )

        self.collection.update_one(
            filter={'project_id': project_id.to_str(), 'previous_version': version},
            update={'$set': {'is_latest': True}},
        )

    def remove_version(self, project_id: ProjectId, version: str) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'previous_version': version})
        if data is None:
            raise Exception(f'Base Model with version {version} does not exist')

        self.collection.delete_many(
            filter={'project_id': project_id.to_str(), 'previous_version': version},
        )


base_model_repository = BaseModelRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'base_models_projection'
    )
)
