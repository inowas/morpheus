import dataclasses

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.common.types import DateTime
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.ModelVersion import ModelVersion, VersionId, VersionTag, VersionDescription
from morpheus.settings import settings as app_settings


@dataclasses.dataclass(frozen=True)
class ModelVersionTagRepositoryDocument:
    project_id: str
    version_id: str
    tag: str
    description: str
    created_by: str
    created_at: str

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            version_id=obj['version_id'],
            tag=obj['tag'],
            description=obj['description'],
            created_by=obj['created_by'],
            created_at=obj['created_at'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_version(self) -> ModelVersion:
        return ModelVersion(version_id=VersionId.from_str(self.version_id), tag=VersionTag.from_str(self.tag), description=VersionDescription.from_str(self.description))


class ModelVersionTagRepository(RepositoryBase):
    def create_new_version(self, project_id: ProjectId, version: ModelVersion, created_by: UserId, created_at: DateTime) -> None:
        document = ModelVersionTagRepositoryDocument(
            project_id=project_id.to_str(),
            version_id=version.version_id.to_str(),
            tag=version.tag.to_str(),
            description=version.description.to_str(),
            created_by=created_by.to_str(),
            created_at=created_at.to_str(),
        )
        self.collection.insert_one(document.to_dict())

    def get_version_by_id(self, project_id: ProjectId, version_id: VersionId) -> ModelVersion:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'version_id': version_id.to_str()})
        if data is None:
            raise ValueError(f'Version Tag with id {version_id.to_str()} does not exist')

        return ModelVersionTagRepositoryDocument.from_dict(dict(data)).get_version()

    def get_version_by_tag(self, project_id: ProjectId, tag: VersionTag) -> ModelVersion:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'tag': tag.to_str()})
        if data is None:
            raise ValueError(f'Version Tag with tag {tag.to_str()} does not exist')

        return ModelVersionTagRepositoryDocument.from_dict(dict(data)).get_version()

    def get_all_versions(self, project_id: ProjectId) -> list[ModelVersion]:
        documents = self.collection.find({'project_id': project_id.to_str()}).sort('created_at', -1)
        return [ModelVersionTagRepositoryDocument.from_dict(document).get_version() for document in documents]

    def delete_version_by_id(self, project_id: ProjectId, version_id: VersionId) -> None:
        self.collection.delete_one({'project_id': project_id.to_str(), 'version_id': version_id.to_str()})

    def update_version_description(self, project_id: ProjectId, version_id: VersionId, description: VersionDescription) -> None:
        self.collection.update_one(
            {'project_id': project_id.to_str(), 'version_id': version_id.to_str()},
            {'$set': {'description': description.to_str()}}
        )


model_version_tag_repository = ModelVersionTagRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'model_version_tags'
    )
)
