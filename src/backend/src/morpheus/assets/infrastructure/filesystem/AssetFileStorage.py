import os.path

from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from morpheus.assets.types.Asset import AssetId
from morpheus.assets.types.File import File
from morpheus.settings import settings


class AssetFileStorage:
    def __init__(self, base_path: str):
        self._base_path = base_path

    def build_full_base_path(self, asset_id: AssetId) -> str:
        return os.path.join(self._base_path, asset_id.to_str())

    def build_full_file_path(self, asset_id: AssetId, file: File) -> str:
        return os.path.join(self.build_full_base_path(asset_id), file.filename)

    def save_uploaded_file_and_return_full_path(self, asset_id: AssetId, uploaded_file: FileStorage) -> str:
        path = self.build_full_base_path(asset_id)
        filename = secure_filename(uploaded_file.filename)
        os.makedirs(path, mode=0o775, exist_ok=True)
        full_path = os.path.join(path, filename)
        uploaded_file.save(full_path)

        return full_path


asset_file_storage = AssetFileStorage(base_path=settings.MORPHEUS_ASSETS_LOCAL_DATA)
