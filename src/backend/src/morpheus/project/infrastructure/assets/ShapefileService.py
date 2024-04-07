import geopandas
from morpheus.common.types.EpsgCode import EpsgCode
from morpheus.common.types.File import FilePath
from morpheus.project.types.Asset import ShapefileMetadata, ShapefileAssetData
from morpheus.project.types.Exceptions import InvalidShapefileException
from morpheus.project.types.geometry.BoundingBox import BoundingBox


class ShapefileService:
    def extract_asset_metadata(self, file: FilePath) -> ShapefileMetadata:
        geo_data_frame = self._read_wgs_84_geo_data_frame(file)

        unique_geometry_types = geo_data_frame.geom_type.unique()
        if len(unique_geometry_types) != 1:
            raise InvalidShapefileException(f'Found multiple geometry types in shapefile: {unique_geometry_types}')

        wgs_84_bounding_box = BoundingBox.from_tuple_of_coordinates(geo_data_frame.total_bounds.tolist())

        return ShapefileMetadata(
            geometry_type=unique_geometry_types[0],
            n_geometries=len(geo_data_frame),
            wgs_84_bounding_box=wgs_84_bounding_box,
        )

    def extract_asset_data(self, file: FilePath) -> ShapefileAssetData:
        geo_data_frame = self._read_wgs_84_geo_data_frame(file)

        return ShapefileAssetData(
            geo_json=geo_data_frame.__geo_interface__,
        )

    def _read_wgs_84_geo_data_frame(self, file: FilePath) -> geopandas.GeoDataFrame:
        try:
            return geopandas.read_file(file).to_crs(epsg=EpsgCode.WGS_84)
        except Exception as e:
            raise InvalidShapefileException(f'Failed to read geo data frame: {e}')


shapefile_service = ShapefileService()
