from morpheus.common.types.Pagination import PaginationParameters, PaginatedResults
from ...infrastructure.assets.AssetHandlingService import asset_handling_service
from ...infrastructure.assets.GeoTiffService import geo_tiff_service
from ...infrastructure.assets.ShapefileService import shapefile_service
from ...infrastructure.persistence.AssetRepository import asset_repository, AssetRepository
from ...infrastructure.persistence.PreviewImageRepository import preview_image_repository, PreviewImageRepository
from ...types.Asset import Asset, AssetFilter, AssetId, AssetData, AssetType
from ...types.Project import ProjectId


class AssetReader:
    def __init__(
        self,
        _preview_image_repository: PreviewImageRepository,
        _asset_repository: AssetRepository,
    ):
        self._preview_image_repository = _preview_image_repository
        self._asset_repository = _asset_repository

    def get_preview_image(self, project_id: ProjectId) -> Asset | None:
        asset_id = self._preview_image_repository.get_preview_image(project_id)
        if asset_id is None:
            return None

        return self._asset_repository.get_asset(asset_id)

    def get_full_asset_list(self, filter: AssetFilter | None = None) -> list[Asset]:
        return self._asset_repository.get_assets(filter)

    def get_paginated_asset_list(self, pagination: PaginationParameters, filter: AssetFilter | None = None) -> PaginatedResults[Asset]:
        count = self._asset_repository.get_count_assets(filter)

        return PaginatedResults(
            pagination_parameters=pagination,
            total_number_of_results=count,
            items=self._asset_repository.get_assets(filter, skip=pagination.get_number_of_skipped_items_from_beginning(), limit=pagination.page_size),
        )

    def get_asset(self, project_id: ProjectId, asset_id: AssetId) -> Asset | None:
        asset = self._asset_repository.get_asset(asset_id)
        if asset is None or asset.project_id != project_id:
            return None

        return asset

    def get_asset_data(self, project_id: ProjectId, asset_id: AssetId) -> AssetData | None:
        asset = self.get_asset(project_id, asset_id)
        if asset is None:
            return None

        if asset.type == AssetType.GEO_TIFF:
            return geo_tiff_service.extract_asset_data(asset_handling_service.get_full_path_to_asset(asset))

        if asset.type == AssetType.SHAPEFILE:
            return shapefile_service.extract_asset_data(asset_handling_service.get_full_path_to_asset(asset))

        return None


asset_reader = AssetReader(
    preview_image_repository,
    asset_repository,
)
