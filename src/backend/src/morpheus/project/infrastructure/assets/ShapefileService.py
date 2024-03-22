from morpheus.common.types.File import FilePath
from morpheus.project.types.Asset import ShapefileMetadata


class ShapefileService:
    def get_asset_metadata(self, file: FilePath) -> ShapefileMetadata:
        raise NotImplementedError()


shapefile_service = ShapefileService()
