from morpheus.common.types.File import FilePath
from morpheus.project.types.Asset import GeoTiffMetadata


class GeoTiffService:

    def get_asset_metadata(self, file: FilePath) -> GeoTiffMetadata:
        raise NotImplementedError()


geo_tiff_service = GeoTiffService()
