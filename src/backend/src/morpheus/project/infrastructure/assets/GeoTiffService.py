from geotiff import GeoTiff

from morpheus.common.types.EpsgCode import EpsgCode
from morpheus.common.types.File import FilePath
from morpheus.project.types.Asset import GeoTiffMetadata, GeoTiffAssetData
from morpheus.project.types.Exceptions import InvalidGeoTiffException
from morpheus.project.types.geometry.BoundingBox import BoundingBox


class GeoTiffService:
    def extract_asset_metadata(self, file: FilePath) -> GeoTiffMetadata:
        geo_tiff_wgs_84 = self._open_geo_tiff_in_wgs_84(file)
        return self._extract_metadata(geo_tiff_wgs_84)

    def extract_asset_data(self, file: FilePath) -> GeoTiffAssetData:
        geo_tiff_wgs_84 = self._open_geo_tiff_in_wgs_84(file)

        metadata = self._extract_metadata(geo_tiff_wgs_84)
        # TODO this might get very big ...
        wgs_84_coords = 'todo'

        return GeoTiffAssetData(
            n_cols=metadata.n_cols,
            n_rows=metadata.n_rows,
            n_bands=metadata.n_bands,
            wgs_84_bounding_box=metadata.wgs_84_bounding_box,
            wgs_84_coords=wgs_84_coords
        )

    def _open_geo_tiff_in_wgs_84(self, file: FilePath) -> GeoTiff:
        try:
            return GeoTiff(file, as_crs=EpsgCode.WGS_84)
        except Exception as e:
            raise InvalidGeoTiffException(f'Failed to read GeoTiff file: {e}')

    def _extract_metadata(self, geo_tiff: GeoTiff) -> GeoTiffMetadata:

        # TODO I am not sure if this is correct (getting number of bands ...)
        shape = geo_tiff.tif_shape
        if len(shape) == 2:
            n_row, n_col = shape
            n_band = 1
        elif len(shape) == 3:
            n_row, n_col, n_band = shape
        else:
            raise InvalidGeoTiffException(f'Found invalid shape: {shape}')

        # TODO I am not sure if this is correct (this is getting bounding box only for the current band I think)
        wgs_84_bounding_box = BoundingBox.from_tuple_of_points(geo_tiff.tif_bBox_wgs_84)

        return GeoTiffMetadata(
            n_cols=n_col,
            n_rows=n_row,
            n_bands=n_band,
            wgs_84_bounding_box=wgs_84_bounding_box
        )


geo_tiff_service = GeoTiffService()
