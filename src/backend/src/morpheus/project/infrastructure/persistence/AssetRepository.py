import dataclasses
import re
from typing import Mapping, Any

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.common.types.File import File, FileName
from morpheus.settings import settings as app_settings
from ...types.Asset import AssetId, AssetType, Asset, AssetMetadata, AssetFilter, AssetDescription
from ...types.Project import ProjectId


@dataclasses.dataclass(frozen=True)
class AssetRepositoryDocument:
    asset_id: str
    project_id: str
    type: str
    file: dict
    metadata: dict
    description: str | None = None

    @classmethod
    def from_asset(cls, asset: Asset):
        return cls(
            asset_id=asset.asset_id.to_str(),
            project_id=asset.project_id.to_str(),
            type=asset.get_asset_type(),
            file=asset.file.to_dict(),
            metadata=asset.metadata.to_dict(),
            description=asset.description.to_str() if asset.description is not None else None,
        )

    @classmethod
    def from_raw_document(cls, raw_document: Mapping[str, Any]):
        return cls(
            asset_id=raw_document['asset_id'],
            project_id=raw_document['project_id'],
            type=raw_document['type'],
            file=raw_document['file'],
            metadata=raw_document['metadata'],
            description=raw_document['description'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_asset(self) -> Asset:
        return Asset(
            asset_id=AssetId.from_str(self.asset_id),
            project_id=ProjectId.from_str(self.project_id),
            type=AssetType(self.type),
            file=File.from_dict(self.file),
            metadata=AssetMetadata.from_dict_and_type(self.metadata, AssetType(self.type)),
            description=AssetDescription.try_from_str(self.description),
        )


class AssetRepository(RepositoryBase):
    def has_asset(self, asset_id: AssetId) -> bool:
        return self.collection.find_one({'asset_id': asset_id.to_str()}) is not None

    def get_asset(self, asset_id: AssetId) -> Asset | None:
        raw_document = self.collection.find_one({'asset_id': asset_id.to_str()}, {'_id': 0})
        if raw_document is None:
            return None

        return AssetRepositoryDocument.from_raw_document(raw_document).get_asset()

    def get_count_assets(self, filter: AssetFilter | None) -> int:
        return self.collection.count_documents(filter=self._build_raw_filter(filter))

    def get_assets(self, filter: AssetFilter | None, skip: int | None = None, limit: int | None = None) -> list[Asset]:
        raw_documents = self.collection.find(self._build_raw_filter(filter))
        if skip is not None:
            raw_documents = raw_documents.skip(skip)
        if limit is not None:
            raw_documents = raw_documents.limit(limit)

        return [AssetRepositoryDocument.from_raw_document(raw_document).get_asset() for raw_document in raw_documents]

    def _build_raw_filter(self, filter: AssetFilter | None) -> dict:
        raw_filter = {}
        if filter is None:
            return raw_filter

        if filter.project_id is not None:
            raw_filter['project_id'] = filter.project_id.to_str()
        if filter.asset_type is not None:
            raw_filter['type'] = {'$in': [asset_type.value for asset_type in filter.asset_type]}
        if filter.file_name is not None:
            raw_filter['file.file_name'] = re.compile(re.escape(filter.file_name), re.IGNORECASE)
        if filter.description is not None:
            raw_filter['description'] = re.compile(re.escape(filter.description.to_str()), re.IGNORECASE)

        return raw_filter

    def add_asset(self, asset: Asset) -> None:
        if self.has_asset(asset.asset_id):
            raise Exception(f'Asset with id {asset.asset_id.to_str()} already exists')

        self.collection.insert_one(AssetRepositoryDocument.from_asset(asset).to_dict())

    def delete_asset(self, asset_id: AssetId) -> None:
        self.collection.delete_one({'asset_id': asset_id.to_str()})

    def delete_all_assets_for_project(self, project_id: ProjectId) -> None:
        self.collection.delete_many({'project_id': project_id.to_str()})

    def update_asset_file_name(self, asset_id: AssetId, file_name: FileName) -> None:
        self.collection.update_one({'asset_id': asset_id.to_str()}, {'$set': {'file.file_name': file_name}})

    def update_asset_description(self, asset_id: AssetId, description: AssetDescription) -> None:
        self.collection.update_one({'asset_id': asset_id.to_str()}, {'$set': {'description': description.to_str()}})

    def update_asset_metadata(self, asset_id: AssetId, metadata: AssetMetadata) -> None:
        self.collection.update_one({'asset_id': asset_id.to_str()}, {'$set': {'metadata': metadata.to_dict()}})


asset_repository = AssetRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'assets'
    )
)
