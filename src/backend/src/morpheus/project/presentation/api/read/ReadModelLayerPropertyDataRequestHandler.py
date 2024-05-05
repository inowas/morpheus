import json
from enum import StrEnum

from ....application.read.ModelReader import ModelReader
from ....infrastructure.assets.RasterInterpolationService import RasterInterpolationService
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.Project import ProjectId
from ....types.layers.Layer import LayerPropertyName, LayerId, Layer


class DataOutputFormat(StrEnum):
    raster = 'raster'
    grid = 'grid'
    grid_original = 'grid_original'

    @classmethod
    def _missing_(cls, value):
        return cls.raster


class ReadModelLayerPropertyDataRequestHandler:
    def handle(self, project_id: ProjectId, layer_id: LayerId, property_name: LayerPropertyName, output_format: DataOutputFormat):

        model_reader = ModelReader()

        try:
            model = model_reader.get_latest_model(project_id)
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404

        layer = model.layers.get_layer(layer_id)
        if not isinstance(layer, Layer):
            return {'message': 'Layer not found'}, 404

        property_value = layer.get_property_values(property_name)
        if property_value is None:
            return {'message': 'Property not found'}, 404

        data = property_value.get_data()  # type: ignore

        if output_format == DataOutputFormat.grid_original:
            return json.dumps({
                'col_widths': model.spatial_discretization.grid.col_widths,
                'row_heights': model.spatial_discretization.grid.row_heights,
                'rotation': model.spatial_discretization.grid.rotation,
                'min_value': min([min(row) for row in data]) if isinstance(data, list) else data,
                'max_value': max([max(row) for row in data]) if isinstance(data, list) else data,
                'data': data
            }), 200

        if output_format == DataOutputFormat.grid:
            no_data_value = -9999.0

            raster_interpolator = RasterInterpolationService()
            grid = model.spatial_discretization.grid

            target_resolution_x = grid.n_cols() * 5 if grid.n_cols() < 200 else grid.n_cols()

            raster = raster_interpolator.grid_data_to_grid_data_with_equal_cells(grid=grid, data=data, target_resolution_x=target_resolution_x, method='linear',
                                                                                 nodata_value=no_data_value)

            return json.dumps({
                'n_cols': raster.get_n_cols(),
                'n_rows': raster.get_n_rows(),
                'cell_size_x': raster.get_cell_size_x(),
                'cell_size_y': raster.get_cell_size_y(),
                'min_value': raster.get_min_value(),
                'max_value': raster.get_max_value(),
                'data': raster.get_data()
            }), 200

        if output_format == DataOutputFormat.raster:
            no_data_value = -9999.0

            raster_interpolator = RasterInterpolationService()
            grid = model.spatial_discretization.grid

            target_resolution_x = grid.n_cols() * 5 if grid.n_cols() < 200 else grid.n_cols()
            raster = raster_interpolator.grid_data_to_raster_data(grid=grid, data=data, target_resolution_x=target_resolution_x, method='linear', nodata_value=no_data_value)

            return json.dumps({
                'n_cols': raster.get_n_cols(),
                'n_rows': raster.get_n_rows(),
                'cell_size_x': raster.get_cell_size_x(),
                'cell_size_y': raster.get_cell_size_y(),
                'min_value': raster.get_min_value(),
                'max_value': raster.get_max_value(),
                'data': raster.get_data()
            }), 200

        return {'message': f'Invalid output format: {output_format}, valid options are {DataOutputFormat.__members__.keys()}'}, 400
