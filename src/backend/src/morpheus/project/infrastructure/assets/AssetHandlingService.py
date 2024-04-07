from morpheus.common.types.File import FilePath
from morpheus.project.infrastructure.filesystem.AssetFileStorage import AssetFileStorage, asset_file_storage
from morpheus.project.infrastructure.persistence.AssetRepository import asset_repository, AssetRepository
from morpheus.project.types.Asset import Asset, AssetId
from morpheus.project.types.Project import ProjectId


class AssetHandlingService:
    def __init__(self, file_storage: AssetFileStorage, repository: AssetRepository):
        self._file_storage = file_storage
        self._repository = repository

    def persist_asset(self, asset: Asset, source_file: FilePath):
        self._file_storage.save_asset(asset, source_file)
        self._repository.add_asset(asset)

    def delete_asset(self, asset: Asset):
        self._file_storage.delete_asset(asset)
        self._repository.delete_asset(asset.id)

    def delete_asset_by_id(self, asset_id: AssetId):
        asset = self._repository.get_asset(asset_id)
        if asset is None:
            return

        self._file_storage.delete_asset(asset)
        self._repository.delete_asset(asset.id)

    def delete_all_assets_for_project(self, project_id: ProjectId):
        self._repository.delete_all_assets_for_project(project_id=project_id)
        self._file_storage.delete_all_assets_for_project(project_id=project_id)

    def get_full_path_to_asset(self, asset: Asset) -> FilePath:
        return self._file_storage.get_full_path_to_asset(asset)


asset_handling_service = AssetHandlingService(
    file_storage=asset_file_storage,
    repository=asset_repository,
)
