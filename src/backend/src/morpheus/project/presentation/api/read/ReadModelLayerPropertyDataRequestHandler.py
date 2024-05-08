import json
from enum import StrEnum

import numpy as np

from ....application.read.ModelReader import ModelReader
from ....infrastructure.assets.RasterInterpolationService import RasterInterpolationService, InterpolationMethod
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

    def get_min_max(self, data: list[list[float | None]], no_data_value: float | None) -> tuple[float, float]:
        min_value = np.inf
        for row in data:
            for value in row:
                if value != no_data_value and value < min_value:
                    min_value = value
        max_value = -np.inf
        for row in data:
            for value in row:
                if value != no_data_value and value > max_value:
                    max_value = value

        return min_value, max_value

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
                'data': data,
                'nodata_value': None,
            }), 200

        if output_format == DataOutputFormat.grid:
            no_data_value = None
            raster_interpolator = RasterInterpolationService()
            grid = model.spatial_discretization.grid
            target_resolution_x = grid.n_cols() if grid.n_cols() < 200 else int(grid.n_cols() / 2)
            result_data = raster_interpolator.grid_data_to_grid_data_with_equal_cells(grid=grid, data=data, target_resolution_x=target_resolution_x,
                                                                                      method=InterpolationMethod.linear,
                                                                                      no_data_value=no_data_value)

            min_value, max_value = self.get_min_max(result_data, no_data_value)

            return json.dumps({
                'n_cols': len(result_data[0]),
                'n_rows': len(result_data),
                'bounds': grid.get_wgs_bbox(),
                'rotation': grid.rotation.to_float(),
                'min_value': min_value,
                'max_value': max_value,
                'data': result_data,
                'nodata_value': no_data_value,
            }), 200

        if output_format == DataOutputFormat.raster:
            no_data_value = None
            raster_interpolator = RasterInterpolationService()
            grid = model.spatial_discretization.grid
            target_resolution_x = grid.n_cols() if grid.n_cols() < 200 else int(grid.n_cols() / 2)
            cartesian_grid = grid.to_cartesian_grid(n_cols=target_resolution_x)

            result_data = raster_interpolator.grid_to_grid(source_grid=grid, target_grid=cartesian_grid, source_data=data, method=InterpolationMethod.linear,
                                                           no_data_value=no_data_value)

            (x_min, y_min, x_max, y_max) = cartesian_grid.get_wgs_bbox()
            grid_width, grid_height = cartesian_grid.get_wgs_width_height()
            min_value, max_value = self.get_min_max(result_data, no_data_value)

            return json.dumps({
                'n_cols': cartesian_grid.n_cols(),
                'n_rows': cartesian_grid.n_rows(),
                "grid_width": grid_width,
                "grid_height": grid_height,
                'bounds': {
                    'x_min': x_min,
                    'y_min': y_min,
                    'x_max': x_max,
                    'y_max': y_max,
                },
                'rotation': grid.rotation.to_float(),
                'min_value': min_value,
                'max_value': max_value,
                'data': result_data,
                'nodata_value': no_data_value,
            }), 200

        return {'message': f'Invalid output format: {output_format}, valid options are {DataOutputFormat.__members__.keys()}'}, 400
