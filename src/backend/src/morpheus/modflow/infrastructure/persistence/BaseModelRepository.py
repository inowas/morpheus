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
    previous_version_id: str | None
    changes_since: int
    version_string: str | None
    last_change_at: str
    last_change_by: str

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            base_model=obj['base_model'],
            sha1_hash=obj['sha1_hash'],
            previous_version_id=obj['previous_version_id'],
            changes_since=obj['changes_since'],
            version_string=obj['version_string'],
            last_change_at=obj['last_change_at'],
            last_change_by=obj['last_change_by'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_base_model(self) -> ModflowModel:
        return ModflowModel.from_dict(self.base_model)

    def get_sha1_hash(self) -> Sha1Hash:
        return Sha1Hash.from_str(value=self.sha1_hash)

    def with_updated_base_model(self, base_model: ModflowModel, changed_at: DateTime, changed_by: UserId):
        version = self.version_string.split('-')[0] if self.version_string is not None else None
        version_string = f'{version}-{self.changes_since + 1}' if version is not None else None
        sha1_hash = base_model.get_sha1_hash().to_str()

        return dataclasses.replace(
            self, base_model=base_model.to_dict(), sha1_hash=sha1_hash, changes_since=self.changes_since + 1,
            version_string=version_string, last_change_at=changed_at.to_str(), last_change_by=changed_by.to_str()
        )

    def with_assigned_version(self, version: BaseModelVersion, changed_at: DateTime, changed_by: UserId):
        return dataclasses.replace(
            self, previous_version_id=version.version_id.to_str(), version_string=version.to_str(), changes_since=0, last_change_at=changed_at.to_str(),
            last_change_by=changed_by.to_str()
        )

    def with_updated_datetime(self, changed_at: DateTime, changed_by: UserId):
        return dataclasses.replace(
            self, last_change_at=changed_at.to_str(), last_change_by=changed_by.to_str()
        )


class BaseModelRepository(RepositoryBase):

    def get_latest_document(self, project_id: ProjectId, user_id: UserId | None = None) -> BaseModelRepositoryDocument | None:
        if user_id is None:
            data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0}, sort=[('last_change_at', -1)])
        else:
            data = self.collection.find_one({'project_id': project_id.to_str(), 'last_change_by': user_id.to_str()}, {'_id': 0}, sort=[('last_change_at', -1)])

        if data is None:
            return None

        return BaseModelRepositoryDocument.from_dict(dict(data))

    def update_latest_document(self, project_id: ProjectId, document: BaseModelRepositoryDocument, user_id: UserId | None = None) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 1}, sort=[('last_change_at', -1)])

        if isinstance(user_id, UserId):
            data = self.collection.find_one({'project_id': project_id.to_str(), 'last_change_by': user_id.to_str()}, {'_id': 1}, sort=[('last_change_at', -1)])

        if data is None:
            raise Exception(f'Latest Base Model for project with id {project_id} does not exist')

        object_id = data['_id']

        self.collection.update_one(
            filter={'_id': object_id},
            update={'$set': document.to_dict()},
        )

    def append_document(self, document: BaseModelRepositoryDocument) -> None:
        self.collection.insert_one(document.to_dict())

    def remove_intermediate_steps(self, project_id: ProjectId) -> None:
        self.collection.delete_many(filter={'project_id': project_id.to_str(), 'changes_since': {'$gt': 0}})

    def get_latest_base_model(self, project_id: ProjectId) -> ModflowModel:
        document = self.get_latest_document(project_id)
        if document is None:
            raise Exception(f'Base Model for project with id {project_id} does not exist')

        return document.get_base_model()

    def get_latest_base_model_from_user(self, project_id: ProjectId, user_id: UserId) -> ModflowModel:
        document = self.get_latest_document(project_id, user_id)
        if document is None:
            raise Exception(f'Base Model for project with id {project_id} does not exist')

        return document.get_base_model()

    def save_base_model(self, project_id: ProjectId, base_model: ModflowModel, created_at: DateTime, created_by: UserId) -> None:
        document = self.get_latest_document(project_id)
        if document is not None:
            raise Exception(f'Base Model for project with id {project_id} already exists')

        document = BaseModelRepositoryDocument(
            project_id=project_id.to_str(),
            base_model=base_model.to_dict(),
            sha1_hash=base_model.get_sha1_hash().to_str(),
            previous_version_id=None,
            changes_since=0,
            version_string=None,
            last_change_at=created_at.to_str(),
            last_change_by=created_by.to_str(),
        )

        self.append_document(document)

    def update_base_model(self, project_id: ProjectId, base_model: ModflowModel, updated_at: DateTime, updated_by: UserId) -> None:
        # we write a new document with the updated base model for each change
        latest_document = self.get_latest_document(project_id=project_id)
        if latest_document is None:
            raise Exception(f'Latest base Model for project with id {project_id} does not exist')

        new_document = latest_document.with_updated_base_model(base_model=base_model, changed_at=updated_at, changed_by=updated_by)
        self.append_document(new_document)

    def assign_version_to_latest_base_model(self, project_id: ProjectId, version: BaseModelVersion, changed_by: UserId, changed_at: DateTime) -> None:
        # we assign a version to the latest document and delete all intermediate documents with changes_since > 0
        document = self.get_latest_document(project_id=project_id)
        if document is None:
            raise Exception(f'Latest Base Model for project with id {project_id} does not exist')

        document = document.with_assigned_version(version=version, changed_at=changed_at, changed_by=changed_by)
        self.update_latest_document(project_id=project_id, document=document)

        # remove documents with changes_since > 0
        self.remove_intermediate_steps(project_id=project_id)

    def get_latest_base_model_hash(self, project_id: ProjectId) -> Sha1Hash:
        document = self.get_latest_document(project_id=project_id)
        if document is None:
            raise Exception(f'Base Model for project with id {project_id} does not exist')

        return document.get_sha1_hash()

    def switch_to_version(self, project_id: ProjectId, version: BaseModelVersion, changed_by: UserId, changed_at: DateTime) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'previous_version_id': version.version_id.to_str(), 'changes_since': 0})
        if data is None:
            raise Exception(f'Base Model with version {version} does not exist')

        object_id = data['_id']
        document = BaseModelRepositoryDocument.from_dict(dict(data)).with_updated_datetime(changed_at=changed_at, changed_by=changed_by)
        self.collection.update_one({'_id': object_id}, {'$set': document.to_dict()})

        # remove documents with changes_since > 0
        self.remove_intermediate_steps(project_id=project_id)

    def delete_version(self, project_id: ProjectId, version_id: VersionId) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'previous_version_id': version_id.to_str(), 'changes_since': 0})
        if data is None:
            raise Exception(f'Base Model with version {version_id} does not exist')

        self.collection.delete_one(
            filter={'project_id': project_id.to_str(), 'previous_version_id': version_id.to_str(), 'changes_since': 0},
        )


base_model_repository = BaseModelRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'base_models_projection'
    )
)
