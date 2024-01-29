import dataclasses

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.common.types import DateTime
from morpheus.modflow.types.Project import ProjectId
from morpheus.modflow.types.User import UserId
from morpheus.modflow.types.BaseModelVersion import BaseModelVersion, VersionId, VersionTag, VersionDescription
from morpheus.settings import settings as app_settings


@dataclasses.dataclass(frozen=True)
class BaseModelVersionRepositoryDocument:
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

    def get_version(self) -> BaseModelVersion:
        return BaseModelVersion(version_id=VersionId.from_str(self.version_id), tag=VersionTag.from_str(self.tag), description=VersionDescription.from_str(self.description))


class BaseModelVersionRepository(RepositoryBase):
    def create_new_version(self, project_id: ProjectId, version: BaseModelVersion, created_by: UserId, created_at: DateTime) -> None:
        document = BaseModelVersionRepositoryDocument(
            project_id=project_id.to_str(),
            version_id=version.version_id.to_str(),
            tag=version.tag.to_str(),
            description=version.description.to_str(),
            created_by=created_by.to_str(),
            created_at=created_at.to_str(),
        )
        self.collection.insert_one(document.to_dict())

    def get_version_by_id(self, project_id: ProjectId, version_id: VersionId) -> BaseModelVersion:
        data = self.collection.find_one({'project_id': project_id.to_str(), 'version_id': version_id.to_str()})
        if data is None:
            raise ValueError(f'Version with id {version_id.to_str()} does not exist')

        return BaseModelVersionRepositoryDocument.from_dict(dict(data)).get_version()

    def get_all_versions(self, project_id: ProjectId) -> list[BaseModelVersion]:
        return [document.get_version() for document in self.collection.find({'project_id': project_id.to_str()}).sort('created_at', -1)]

    def delete_version_by_id(self, project_id: ProjectId, version_id: VersionId) -> None:
        self.collection.delete_one({'project_id': project_id.to_str(), 'version_id': version_id.to_str()})

    def update_version_description(self, project_id: ProjectId, version_id: VersionId, description: VersionDescription) -> None:
        self.collection.update_one(
            {'project_id': project_id.to_str(), 'version_id': version_id.to_str()},
            {'$set': {'description': description.to_str()}}
        )


base_model_version_repository = BaseModelVersionRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'base_model_versions_projection'
    )
)
