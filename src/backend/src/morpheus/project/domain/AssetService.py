import os.path
import re

from morpheus.common.types.File import File, FileName
from morpheus.project.types.Asset import Asset, AssetType
from morpheus.project.types.Exceptions import InvalidFileNameException, InvalidMimeTypeException


class AssetService:
    @staticmethod
    def assert_file_can_be_used_as_preview_image(file: File):
        allowed_mimetypes = ['image/png', 'image/jpeg']
        if file.mime_type not in allowed_mimetypes:
            raise InvalidMimeTypeException(f'Mimetype {file.mime_type} not allowed for preview image (allowed mimetypes: {", ".join(allowed_mimetypes)})')

    @staticmethod
    def guess_asset_type_for_file(file: File):
        mime_type_asset_type_map = {'image/tiff': AssetType.GEO_TIFF, 'application/zip': AssetType.SHAPEFILE}
        if file.mime_type not in mime_type_asset_type_map:
            raise InvalidMimeTypeException(f'Mimetype {file.mime_type} not allowed for assets (allowed mimetypes: {", ".join(mime_type_asset_type_map.keys())})')

        return mime_type_asset_type_map[file.mime_type]

    @staticmethod
    def assert_filename_can_be_changed_for_asset(asset: Asset, new_file_name: FileName):
        if asset.file.file_name == new_file_name:
            return

        _, old_ext = os.path.splitext(asset.file.file_name)
        new_file_name_without_ext, new_ext = os.path.splitext(new_file_name)

        if old_ext != new_ext:
            raise InvalidFileNameException(f'New file name must have the same extension (old: {old_ext}, new: {new_ext})')

        if re.match('^[A-Za-z0-9_-]+$', new_file_name_without_ext) is None:
            raise InvalidFileNameException(f'Invalid file name: {new_file_name}')

    @staticmethod
    def assert_no_data_value_can_be_changed_for_asset(asset: Asset):
        if asset.type != AssetType.GEO_TIFF:
            raise ValueError(f'Asset type must be GEO_TIFF, but was {asset.type}')
