from typing import Tuple

import numpy as np
from geotiff import GeoTiff

from morpheus.common.types.EpsgCode import EpsgCode
from morpheus.common.types.File import FilePath
from morpheus.project.types.Asset import GeoTiffMetadata, GeoTiffAssetData, NoDataValue
from morpheus.project.types.Exceptions import InvalidGeoTiffException
from morpheus.project.types.geometry.BoundingBox import BoundingBox

IBBox = tuple[float, float, float, float]


class GeoTiffService:
    def extract_asset_metadata(self, file: FilePath) -> GeoTiffMetadata:
        geo_tiff_wgs_84 = self._open_geo_tiff_in_wgs_84(file)
        return self._extract_metadata(geo_tiff_wgs_84)

    def extract_asset_data(self, file: FilePath, band: int) -> GeoTiffAssetData:
        geo_tiff_wgs_84 = self._open_geo_tiff_in_wgs_84(file)
        metadata = self._extract_metadata(geo_tiff_wgs_84)

        geo_tiff = self._open_geo_tiff_in_wgs_84(file)
        zarr_array = geo_tiff.read()
        shape = zarr_array.shape
        if len(shape) == 2:
            data = np.array(zarr_array).tolist()
        elif len(shape) == 3:
            data = np.array(zarr_array)[band].tolist()
        else:
            raise InvalidGeoTiffException(f'Found invalid shape: {shape}')

        return GeoTiffAssetData(
            n_cols=metadata.n_cols,
            n_rows=metadata.n_rows,
            band=band,
            wgs_84_bounding_box=metadata.wgs_84_bounding_box,
            data=data
        )

    # returns a tuple of two lists of 1D-floats, the first list contains the x coordinates and the second list contains the y coordinates
    # example: ([1.0, 2.0, 3.0], [4.0, 5.0, 6.0])
    def extract_asset_coordinates(self, file: FilePath, bbox: IBBox | None) -> Tuple[list[list[float]], list[list[float]]] | None:
        geo_tiff = self._open_geo_tiff_in_wgs_84(file)
        coords_x, coords_y = geo_tiff.get_coord_arrays()

        if len(coords_x.shape) < 2 or len(coords_y.shape) < 2:
            return None

        if len(coords_x.shape) == 3 or len(coords_y.shape) == 3:
            coords_x = coords_x[0]
            coords_y = coords_y[:, 0]

        return coords_x.tolist(), coords_y.tolist()

    def _open_geo_tiff_in_wgs_84(self, file: FilePath) -> GeoTiff:
        try:
            return GeoTiff(file, as_crs=EpsgCode.WGS_84)
        except Exception as e:
            raise InvalidGeoTiffException(f'Failed to read GeoTiff file: {e}')

    def _extract_metadata(self, geo_tiff: GeoTiff) -> GeoTiffMetadata:
        shape = geo_tiff.tif_shape
        if len(shape) == 2:
            n_row, n_col = shape
            n_band = 1
        elif len(shape) == 3:
            n_row, n_col, n_band = shape
        else:
            raise InvalidGeoTiffException(f'Found invalid shape: {shape}')

        wgs_84_bounding_box = BoundingBox.from_tuple_of_points(geo_tiff.tif_bBox_wgs_84)

        # guess no data value
        zarr_array = np.array(geo_tiff.read())
        min_value = float(np.min(zarr_array))

        no_data_value = NoDataValue.from_float(-9999.0)
        if min_value in [-9999.0, -32768.0, -3.4028235e+38]:
            no_data_value = NoDataValue.from_float(min_value)

        return GeoTiffMetadata(
            n_cols=n_col,
            n_rows=n_row,
            n_bands=n_band,
            wgs_84_bounding_box=wgs_84_bounding_box,
            no_data_value=no_data_value
        )


def get_geo_tiff_service() -> GeoTiffService:
    return geo_tiff_service


geo_tiff_service = GeoTiffService()
