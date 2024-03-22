from morpheus.common.types.File import FilePath
from PIL import Image, ImageOps

class PreviewImageService:
    def __init__(self, preview_image_dimensions: tuple[int, int]):
        self._preview_image_dimensions = preview_image_dimensions

    def resize_as_preview_image(self, file: FilePath):
        with Image.open(file) as img:
            img.thumbnail(self._preview_image_dimensions)
            img.save(file)


preview_image_service = PreviewImageService((100, 100))
