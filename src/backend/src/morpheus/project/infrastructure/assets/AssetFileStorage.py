import os.path
from shutil import copyfile

from morpheus.common.types.File import FilePath
from morpheus.project.types.Asset import Asset
from morpheus.settings import settings


class AssetFileStorage:
    def __init__(self, base_path: str):
        self._base_path = base_path

    def save_asset(self, asset: Asset, source_file: FilePath):
        project_path = os.path.join(self._base_path, asset.project_id.to_str())
        os.makedirs(project_path, mode=0o775, exist_ok=True)

        _, extension = os.path.splitext(asset.file.filename)
        dst_file = os.path.join(project_path, asset.id.to_str() + extension)

        copyfile(source_file, dst_file)


asset_file_storage = AssetFileStorage(base_path=settings.MORPHEUS_PROJECT_ASSET_DATA)
