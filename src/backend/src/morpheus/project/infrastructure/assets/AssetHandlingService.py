from morpheus.common.types.File import FileName, FilePath
from morpheus.project.infrastructure.filesystem.AssetFileStorage import AssetFileStorage, asset_file_storage
from morpheus.project.infrastructure.persistence.AssetRepository import AssetRepository, asset_repository
from morpheus.project.types.Asset import Asset, AssetDescription, AssetId, AssetMetadata
from morpheus.project.types.Project import ProjectId


class AssetHandlingService:
    def __init__(self, file_storage: AssetFileStorage, repository: AssetRepository):
        self._file_storage = file_storage
        self._repository = repository

    def persist_asset(self, asset: Asset, source_file: FilePath):
        self._file_storage.save_asset(asset, source_file)
        self._repository.add_asset(asset)

    def update_asset_file_name(self, asset_id: AssetId, file_name: FileName):
        self._repository.update_asset_file_name(asset_id=asset_id, file_name=file_name)

    def update_asset_description(self, asset_id: AssetId, description: AssetDescription):
        self._repository.update_asset_description(asset_id=asset_id, description=description)

    def update_asset_metadata(self, asset_id: AssetId, metadata: AssetMetadata):
        self._repository.update_asset_metadata(asset_id=asset_id, metadata=metadata)

    def delete_asset(self, asset: Asset):
        self._file_storage.delete_asset(asset)
        self._repository.delete_asset(asset.asset_id)

    def delete_asset_by_id(self, asset_id: AssetId):
        asset = self._repository.get_asset(asset_id)
        if asset is None:
            return

        self._file_storage.delete_asset(asset)
        self._repository.delete_asset(asset.asset_id)

    def delete_all_assets_for_project(self, project_id: ProjectId):
        self._repository.delete_all_assets_for_project(project_id=project_id)
        self._file_storage.delete_all_assets_for_project(project_id=project_id)

    def get_full_path_to_asset(self, asset: Asset) -> FilePath:
        return self._file_storage.get_full_path_to_asset(asset)


asset_handling_service = AssetHandlingService(
    file_storage=asset_file_storage,
    repository=asset_repository,
)


def get_asset_handling_service() -> AssetHandlingService:
    return asset_handling_service
