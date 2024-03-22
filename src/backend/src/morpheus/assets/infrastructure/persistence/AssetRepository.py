import dataclasses
from typing import Mapping, Any

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.settings import settings as app_settings
from ...types.Asset import AssetId, AssetType, Asset
from ...types.File import File


@dataclasses.dataclass(frozen=True)
class AssetRepositoryDocument:
    asset_id: str
    type: str
    file: dict

    @classmethod
    def from_asset(cls, asset: Asset):
        return cls(
            asset_id=asset.id.to_str(),
            type=asset.type.value(),
            file=asset.file.to_dict(),
        )

    @classmethod
    def from_raw_document(cls, raw_document: Mapping[str, Any]):
        return cls(
            asset_id=raw_document['asset_id'],
            type=raw_document['type'],
            file=raw_document['file'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_asset_id(self) -> AssetId:
        return AssetId.from_str(self.asset_id)

    def get_type(self) -> AssetType:
        return AssetType(self.type)

    def get_file(self) -> File:
        return File.from_dict(self.file)


class AssetRepository(RepositoryBase):
    def has_asset(self, asset_id: AssetId) -> bool:
        return self.collection.find_one({'asset_id': asset_id.to_str()}) is not None

    def get_file(self, asset_id: AssetId) -> File | None:
        raw_document = self.collection.find_one({'asset_id': asset_id.to_str()}, {'_id': 0})
        if raw_document is None:
            return None

        return AssetRepositoryDocument.from_raw_document(raw_document).get_file()

    def add_asset(self, asset: Asset) -> None:
        if self.has_asset(asset.id):
            raise Exception(f'Asset with id {asset.id.to_str()} already exists')

        self.collection.insert_one(AssetRepositoryDocument.from_asset(asset).to_dict())

    def delete_asset(self, asset_id: AssetId) -> None:
        self.collection.delete_one({'asset_id': asset_id.to_str()})


asset_repository = AssetRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'assets'
    )
)
