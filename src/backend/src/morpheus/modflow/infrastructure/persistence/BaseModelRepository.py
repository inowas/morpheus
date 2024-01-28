import dataclasses

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.common.types import DateTime
from morpheus.modflow.types.ModflowModel import ModflowModel, Sha1Hash
from morpheus.modflow.types.Project import ProjectId
from morpheus.modflow.types.User import UserId
from morpheus.modflow.types.BaseModelVersion import BaseModelVersion, VersionId
from morpheus.settings import settings as app_settings


@dataclasses.dataclass(frozen=True)
class BaseModelRepositoryDocument:
    project_id: str
    base_model: dict
    sha1_hash: str
    latest_version_id: str | None
    changes_since: int
    version_string: str
    is_latest: bool
    changed_at: str
    changed_by: str

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            base_model=obj['base_model'],
            sha1_hash=obj['sha1_hash'],
            latest_version_id=obj['latest_version_id'],
            changes_since=obj['changes_since'],
            version_string=obj['version_string'],
            is_latest=obj['is_latest'],
            changed_at=obj['changed_at'],
            changed_by=obj['changed_by'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_base_model(self) -> ModflowModel:
        return ModflowModel.from_dict(self.base_model)

    def get_sha1_hash(self) -> Sha1Hash:
        return Sha1Hash.from_str(value=self.sha1_hash)

    def with_updated_latest_base_model(self, base_model: ModflowModel, changed_at: DateTime, changed_by: UserId):
        version = self.version_string.split('-')[0]

        return dataclasses.replace(
            self, base_model=base_model.to_dict(), sha1_hash=base_model.get_sha1_hash().to_str(), changes_since=self.changes_since + 1,
            version_string=f'{version}-{self.changes_since + 1}', is_latest=True, changed_at=changed_at.to_str(), changed_by=changed_by.to_str()
        )

    def with_assigned_version(self, version: BaseModelVersion):
        return dataclasses.replace(self, latest_version_id=version.version_id.to_str(), version_string=version.to_str())

    def with_latest_tag_disabled(self):
        return dataclasses.replace(self, is_latest=False)

    def with_latest_tag_enabled(self):
        return dataclasses.replace(self, is_latest=True)


class BaseModelRepository(RepositoryBase):

    def get_latest(self, project_id: ProjectId, user_id: UserId) -> ModflowModel:
        data = self.collection.find_one({
            'project_id': project_id.to_str(),
            'is_latest': True,
            'changed_by': user_id.to_str(),
        }, {'_id': 0})
        if data is None:
            raise Exception('Base Model does not exist')

        return BaseModelRepositoryDocument.from_dict(dict(data)).get_base_model()

    def save_base_model(self, project_id: ProjectId, base_model: ModflowModel, changed_by: UserId, changed_at: DateTime) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'is_latest': True})
        if data is not None:
            raise Exception('Latest base model already exists')

        document = BaseModelRepositoryDocument(
            project_id=project_id.to_str(),
            base_model=base_model.to_dict(),
            sha1_hash=base_model.get_sha1_hash().to_str(),
            latest_version_id=None,
            changes_since=0,
            version_string='v0.0.0',
            is_latest=True,
            changed_at=changed_at.to_str(),
            changed_by=changed_by.to_str(),
        )

        self.collection.insert_one(document.to_dict())

    def assign_version_to_latest_base_model(self, project_id: ProjectId, version: BaseModelVersion, changed_by: UserId, changed_at: DateTime) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'is_latest': True})
        if data is None:
            raise Exception('Latest base model does not exist')

        # get the latest document and set the new version
        document = BaseModelRepositoryDocument.from_dict(dict(data)).with_assigned_version(version=version)

        self.collection.replace_one(
            filter={'project_id': project_id.to_str(), 'is_latest': True},
            replacement=document.to_dict(),
        )

    def update_latest_base_model(self, project_id: ProjectId, base_model: ModflowModel, changed_at: DateTime, changed_by: UserId) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'is_latest': True})
        if data is None:
            raise Exception('Latest base model does not exist')

        document = (BaseModelRepositoryDocument.from_dict(dict(data))
                    .with_updated_latest_base_model(base_model=base_model, changed_at=changed_at, changed_by=changed_by))

        # disable the latest tag for the old document
        self.collection.update_many(
            filter={'project_id': project_id.to_str(), 'is_latest': True},
            update={'$set': {'is_latest': False}},
        )

        self.collection.insert_one(document.to_dict())

    def get_latest_base_model(self, project_id: ProjectId) -> ModflowModel:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'is_latest': True}, {'_id': 0})
        if data is None:
            raise Exception('Base Model does not exist')

        return BaseModelRepositoryDocument.from_dict(dict(data)).get_base_model()

    def get_latest_base_model_hash(self, project_id: ProjectId) -> Sha1Hash:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'is_latest': True}, {'_id': 0, 'sha1_hash': 1})
        if data is None:
            raise Exception('Base Model does not exist')

        return Sha1Hash.from_str(value=data['sha1_hash'])

    def switch_to_version(self, project_id: ProjectId, version_id: VersionId) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'latest_version_id': version_id.to_str(), 'changes_since': 0})
        if data is None:
            raise Exception(f'Base Model with version {version_id} does not exist')

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
            filter={'project_id': project_id.to_str(), 'latest_version_id': version_id, 'changes_since': 0},
            update={'$set': {'is_latest': True}},
        )

    def remove_version(self, project_id: ProjectId, version: VersionId) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'latest_version_id': version.to_str(), 'changes_since': 0})
        if data is None:
            raise Exception(f'Base Model with version {version} does not exist')

        self.collection.delete_one(
            filter={'project_id': project_id.to_str(), 'latest_version_id': version.to_str(), 'changes_since': 0},
        )


base_model_repository = BaseModelRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'base_models_projection'
    )
)
