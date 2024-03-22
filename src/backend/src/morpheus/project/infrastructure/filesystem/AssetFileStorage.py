import os.path
from shutil import copyfile

from morpheus.common.types.File import FilePath
from morpheus.project.types.Asset import Asset
from morpheus.settings import settings


class AssetFileStorage:
    def __init__(self, base_path: str):
        self._base_path = base_path

    def _build_project_path(self, asset: Asset) -> str:
        return os.path.join(self._base_path, asset.project_id.to_str())

    def _build_filename(self, asset: Asset) -> str:
        _, extension = os.path.splitext(asset.file.filename)
        return asset.id.to_str() + extension

    def get_full_path_to_asset(self, asset: Asset) -> FilePath:
        return FilePath(os.path.join(self._build_project_path(asset), self._build_filename(asset)))

    def save_asset(self, asset: Asset, source_file: FilePath):
        project_path = self._build_project_path(asset)
        os.makedirs(project_path, mode=0o775, exist_ok=True)

        dst_file = os.path.join(project_path, self._build_filename(asset))

        copyfile(source_file, dst_file)

    def delete_asset(self, asset: Asset):
        full_path = os.path.join(self._build_project_path(asset), self._build_filename(asset))
        os.remove(full_path)


asset_file_storage = AssetFileStorage(base_path=settings.MORPHEUS_PROJECT_ASSET_DATA)
