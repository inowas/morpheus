import dataclasses
from typing import Mapping, Any
import pymongo
from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.settings import settings as app_settings
from ...types.Asset import AssetId
from ...types.Project import ProjectId


@dataclasses.dataclass(frozen=True)
class PreviewImageRepositoryDocument:
    project_id: str
    asset_id: str

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            asset_id=obj['asset_id'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_asset_id(self) -> AssetId:
        return AssetId.from_str(self.asset_id)

    @classmethod
    def from_raw_document(cls, raw_document: Mapping[str, Any]):
        return cls(
            asset_id=raw_document['asset_id'],
            project_id=raw_document['project_id'],
        )


class PreviewImageRepository(RepositoryBase):
    def has_preview_image(self, project_id: ProjectId) -> bool:
        return self.collection.find_one({'project_id': project_id.to_str()}) is not None

    def get_preview_image(self, project_id: ProjectId) -> AssetId | None:
        raw_document = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if raw_document is None:
            return None

        return PreviewImageRepositoryDocument.from_raw_document(raw_document).get_asset_id()

    def update_preview_image(self, project_id: ProjectId, asset_id: AssetId) -> None:
        document = PreviewImageRepositoryDocument(project_id=project_id.to_str(), asset_id=asset_id.to_str())
        if self.has_preview_image(project_id):
            self.collection.update_one(filter={'project_id': project_id.to_str()}, update={'$set': document.to_dict()})
            return

        self.collection.insert_one(document.to_dict())

    def delete_preview_image(self, project_id: ProjectId) -> None:
        self.collection.delete_one(filter={'project_id': project_id.to_str()})


preview_image_repository = PreviewImageRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'preview_images',
        lambda collection: collection.create_index(
            [
                ('project_id', pymongo.ASCENDING),
            ],
            unique=True,
        )
    )
)
