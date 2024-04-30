import json
from typing import Literal

from flask import send_file

from ....application.read.ModelReader import ModelReader
from ....infrastructure.assets.ImageCreationService import ImageCreationService
from ....infrastructure.assets.RasterInterpolationService import RasterInterpolationService
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.Project import ProjectId
from ....types.layers.Layer import LayerPropertyName, LayerId, Layer


class ReadModelLayerPropertyRequestHandler:
    def handle(self, project_id: ProjectId, layer_id: LayerId, property_name: LayerPropertyName, output_format: Literal['json', 'image', 'colorbar'] | str = 'json'):
        model_reader = ModelReader()

        try:
            model = model_reader.get_latest_model(project_id)
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404

        layer = model.layers.get_layer(layer_id)
        if not isinstance(layer, Layer):
            return {'message': 'Layer not found'}, 404

        property_value = layer.get_property_value(property_name)
        if property_value is None:
            return {'message': 'Property not found'}, 404

        data = property_value.get_data()  # type: ignore
        if output_format == 'json':
            return json.dumps(data), 200

        no_data_value = -9999.0

        image_creation_service = ImageCreationService()

        if output_format == 'image':
            raster_interpolator = RasterInterpolationService()
            grid = model.spatial_discretization.grid

            target_resolution_x = grid.n_cols() * 5 if grid.n_cols() < 200 else grid.n_cols()
            raster = raster_interpolator.grid_data_to_raster(grid=grid, data=data, target_resolution_x=target_resolution_x, method='linear', nodata_value=no_data_value)

            image = image_creation_service.create_image_from_raster(raster=raster, cmap='jet_r')
            return send_file(image, mimetype='image/png', max_age=0)

        if output_format == 'colorbar':
            image = image_creation_service.create_colorbar_from_data(data=data, cmap='jet_r', no_data_value=-9999.0)
            return send_file(image, mimetype='image/png', max_age=0)
