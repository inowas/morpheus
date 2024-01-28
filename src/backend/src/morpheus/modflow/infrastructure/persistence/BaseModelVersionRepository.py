import dataclasses
from typing import List, Tuple

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.common.types import DateTime
from morpheus.modflow.types.ModflowModel import Sha1Hash
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
    sha1_hash: str
    created_by: str
    created_at: str

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            version_id=obj['version_id'],
            tag=obj['tag'],
            description=obj['description'],
            sha1_hash=obj['sha1_hash'],
            created_by=obj['created_by'],
            created_at=obj['created_at'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_version(self) -> BaseModelVersion:
        return BaseModelVersion(version_id=VersionId.from_str(self.version_id), tag=VersionTag.from_str(self.tag), description=VersionDescription.from_str(self.description))


class BaseModelVersionRepository(RepositoryBase):
    def create_new_version(self, project_id: ProjectId, version: BaseModelVersion, sha1_hash: Sha1Hash, created_by: UserId, created_at: DateTime) -> None:
        document = BaseModelVersionRepositoryDocument(
            project_id=project_id.to_str(),
            version_id=version.version_id.to_str(),
            tag=version.tag.to_str(),
            description=version.description.to_str(),
            sha1_hash=sha1_hash.to_str(),
            created_by=created_by.to_str(),
            created_at=created_at.to_str(),
        )
        self.collection.insert_one(document.to_dict())

    def get_latest_version(self, project_id: ProjectId) -> Tuple[BaseModelVersion, Sha1Hash] | None:
        document = self.collection.find_one({'project_id': project_id.to_str()}, sort=[('created_at', -1)])
        if document is None:
            return None

        sha1_hash = document['sha1_hash'] if 'sha1_hash' in document else None
        if sha1_hash is None:
            return None

        return BaseModelVersion(version_id=document['version_id'], tag=document['tag'], description=document['description']), Sha1Hash(document['hash'])

    def get_all_versions(self, project_id: ProjectId) -> List[Tuple[BaseModelVersion, Sha1Hash]]:
        documents = self.collection.find({'project_id': project_id.to_str()}, sort=[('created_at', -1)])
        result = []
        for document in documents:
            result.append((BaseModelVersion(version_id=document['version_id'], tag=document['tag'], description=document['description']), Sha1Hash(document['hash'])))
        return result

    def delete_version_by_id(self, project_id: ProjectId, version_id: VersionId) -> None:
        self.collection.delete_one({'project_id': project_id.to_str(), 'version_id': version_id.to_str()})

    def update_version_by_id(self, project_id: ProjectId, version_id: VersionId, version: BaseModelVersion) -> None:
        self.collection.update_one(
            {'project_id': project_id.to_str(), 'version_id': version_id.to_str()},
            {'$set': {'tag': version.tag.to_str(), 'description': version.description.to_str()}}
        )


base_model_version_repository = BaseModelVersionRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'base_model_versions_projection'
    )
)
