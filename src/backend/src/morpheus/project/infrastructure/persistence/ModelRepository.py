import dataclasses

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.common.types import DateTime
from morpheus.project.types.Model import Model, Sha1Hash
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.ModelVersion import ModelVersion, VersionId
from morpheus.settings import settings as app_settings


class ModelNotFoundException(Exception):
    pass


@dataclasses.dataclass(frozen=True)
class ModelRepositoryDocument:
    project_id: str
    model: dict
    sha1_hash: str
    version_id: str | None
    number_of_changes: int
    version_string: str | None
    last_change_at: str
    last_change_by: str

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            model=obj['model'],
            sha1_hash=obj['sha1_hash'],
            version_id=obj['version_id'],
            number_of_changes=obj['number_of_changes'],
            version_string=obj['version_string'],
            last_change_at=obj['last_change_at'],
            last_change_by=obj['last_change_by'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_model(self) -> Model:
        return Model.from_dict(self.model)

    def get_sha1_hash(self) -> Sha1Hash:
        return Sha1Hash.from_str(value=self.sha1_hash)

    def with_updated_model(self, model: Model, changed_at: DateTime, changed_by: UserId):
        version = self.version_string.split('-')[0] if self.version_string is not None else None
        version_string = f'{version}-{self.number_of_changes + 1}' if version is not None else None
        sha1_hash = model.get_sha1_hash().to_str()

        return dataclasses.replace(
            self, model=model.to_dict(), sha1_hash=sha1_hash, number_of_changes=self.number_of_changes + 1,
            version_string=version_string, last_change_at=changed_at.to_str(), last_change_by=changed_by.to_str()
        )

    def with_assigned_version(self, version: ModelVersion, changed_at: DateTime, changed_by: UserId):
        return dataclasses.replace(
            self, version_id=version.version_id.to_str(), version_string=version.to_str(), number_of_changes=0, last_change_at=changed_at.to_str(),
            last_change_by=changed_by.to_str()
        )

    def with_updated_datetime(self, changed_at: DateTime, changed_by: UserId):
        return dataclasses.replace(
            self, last_change_at=changed_at.to_str(), last_change_by=changed_by.to_str()
        )


class ModelRepository(RepositoryBase):

    def get_latest_document(self, project_id: ProjectId, user_id: UserId | None = None) -> ModelRepositoryDocument | None:
        if user_id is None:
            data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0}, sort=[('last_change_at', -1)])
        else:
            data = self.collection.find_one({'project_id': project_id.to_str(), 'last_change_by': user_id.to_str()}, {'_id': 0}, sort=[('last_change_at', -1)])

        if data is None:
            return None

        return ModelRepositoryDocument.from_dict(dict(data))

    def update_latest_document(self, project_id: ProjectId, document: ModelRepositoryDocument, user_id: UserId | None = None) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 1}, sort=[('last_change_at', -1)])

        if isinstance(user_id, UserId):
            data = self.collection.find_one({'project_id': project_id.to_str(), 'last_change_by': user_id.to_str()}, {'_id': 1}, sort=[('last_change_at', -1)])

        if data is None:
            raise ModelNotFoundException(f'Latest model for project with id {project_id} does not exist')

        object_id = data['_id']

        self.collection.update_one(
            filter={'_id': object_id},
            update={'$set': document.to_dict()},
        )

    def append_document(self, document: ModelRepositoryDocument) -> None:
        self.collection.insert_one(document.to_dict())

    def remove_intermediate_steps(self, project_id: ProjectId) -> None:
        self.collection.delete_many(filter={'project_id': project_id.to_str(), 'number_of_changes': {'$gt': 0}})

    def get_latest_model(self, project_id: ProjectId) -> Model:
        document = self.get_latest_document(project_id)
        if document is None:
            raise ModelNotFoundException(f'Model for project with id {project_id} does not exist')

        return document.get_model()

    def save_model(self, project_id: ProjectId, model: Model, created_at: DateTime, created_by: UserId) -> None:
        document = self.get_latest_document(project_id)
        if document is not None:
            raise ModelNotFoundException(f'Model for project with id {project_id} already exists')

        document = ModelRepositoryDocument(
            project_id=project_id.to_str(),
            model=model.to_dict(),
            sha1_hash=model.get_sha1_hash().to_str(),
            version_id=None,
            number_of_changes=0,
            version_string=None,
            last_change_at=created_at.to_str(),
            last_change_by=created_by.to_str(),
        )

        self.append_document(document)

    def update_model(self, project_id: ProjectId, model: Model, updated_at: DateTime, updated_by: UserId) -> None:
        # we write a new document with the updated model for each change
        latest_document = self.get_latest_document(project_id=project_id)
        if latest_document is None:
            raise ModelNotFoundException(f'Latest model for project with id {project_id} does not exist')

        new_document = latest_document.with_updated_model(model=model, changed_at=updated_at, changed_by=updated_by)
        self.append_document(new_document)

    def delete_model(self, project_id: ProjectId) -> None:
        self.collection.delete_many(filter={'project_id': project_id.to_str()})

    def assign_version_to_latest_model(self, project_id: ProjectId, version: ModelVersion, changed_by: UserId, changed_at: DateTime) -> None:
        # we assign a version to the latest document and delete all intermediate documents with number_of_changes > 0
        document = self.get_latest_document(project_id=project_id)
        if document is None:
            raise ModelNotFoundException(f'Latest model for project with id {project_id} does not exist')

        # do nothing if already tagged with the same version
        if document.version_id == version.version_id.to_str() and document.number_of_changes == 0:
            return None

        # happy path: update latest document with new version and remove intermediate steps
        if document.number_of_changes > 0:
            document = document.with_assigned_version(version=version, changed_at=changed_at, changed_by=changed_by)
            self.update_latest_document(project_id=project_id, document=document)

            # remove documents with number_of_changes > 0
            self.remove_intermediate_steps(project_id=project_id)
            return None

        # if set a version twice, we need to create a new document with the same model and the new version
        document = document.with_assigned_version(version=version, changed_at=changed_at, changed_by=changed_by)
        self.append_document(document)

    def get_latest_model_hash(self, project_id: ProjectId) -> Sha1Hash:
        document = self.get_latest_document(project_id=project_id)
        if document is None:
            raise ModelNotFoundException(f'Model for project with id {project_id} does not exist')

        return document.get_sha1_hash()

    def switch_to_version(self, project_id: ProjectId, version: ModelVersion, changed_by: UserId, changed_at: DateTime) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'version_id': version.version_id.to_str(), 'number_of_changes': 0})
        if data is None:
            raise ModelNotFoundException(f'Model with version {version} does not exist')

        object_id = data['_id']
        document = ModelRepositoryDocument.from_dict(dict(data)).with_updated_datetime(changed_at=changed_at, changed_by=changed_by)
        self.collection.update_one({'_id': object_id}, {'$set': document.to_dict()})

        # remove documents with number_of_changes > 0
        self.remove_intermediate_steps(project_id=project_id)

    def delete_version(self, project_id: ProjectId, version_id: VersionId) -> None:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'version_id': version_id.to_str(), 'number_of_changes': 0})
        if data is None:
            raise ModelNotFoundException(f'Model with version {version_id} does not exist')

        self.collection.delete_one(
            filter={'project_id': project_id.to_str(), 'version_id': version_id.to_str(), 'number_of_changes': 0},
        )


model_repository = ModelRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'models'
    )
)
