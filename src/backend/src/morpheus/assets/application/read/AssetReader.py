from ...infrastructure.persistence.AssetRepository import asset_repository
from ...types.Asset import AssetId


class AssetReader:
    def has_asset(self, asset_id: AssetId) -> bool:
        return asset_repository.has_asset(asset_id=asset_id)


asset_reader = AssetReader()
