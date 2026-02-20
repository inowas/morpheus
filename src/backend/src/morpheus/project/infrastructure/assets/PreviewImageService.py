from PIL import Image

from morpheus.common.types.File import FilePath
from morpheus.project.types.Asset import ImageMetadata
from morpheus.settings import settings


class PreviewImageService:
    def __init__(self, preview_image_dimensions: tuple[int, int]):
        self._preview_image_dimensions = preview_image_dimensions

    def resize_as_preview_image(self, file: FilePath):
        with Image.open(file) as img:
            img.thumbnail(self._preview_image_dimensions)
            img.save(file)

    def extract_asset_metadata(self, file: FilePath) -> ImageMetadata:
        with Image.open(file) as img:
            return ImageMetadata(width=img.width, height=img.height)


preview_image_service = PreviewImageService(settings.MORPHEUS_PROJECT_PREVIEW_IMAGE_DIMENSIONS)
