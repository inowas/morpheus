from morpheus.common.types.File import File
from morpheus.project.types.Exceptions import InvalidMimeTypeException


class AssetService:
    @staticmethod
    def assert_file_can_be_used_as_preview_image(file: File):
        allowed_mimetypes = ['image/png', 'image/jpeg']
        if file.mimetype not in allowed_mimetypes:
            raise InvalidMimeTypeException(f'Mimetype {file.mimetype} not allowed for preview image (allowed mimetypes: {', '.join(allowed_mimetypes)})')
