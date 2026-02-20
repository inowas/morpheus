from enum import StrEnum

from flask import send_file

from morpheus.common.types.Exceptions import InsufficientPermissionsException

from ....application.read.ModelReader import ModelReader
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....infrastructure.assets.ImageCreationService import ImageCreationService
from ....infrastructure.assets.RasterInterpolationService import InterpolationMethod, RasterInterpolationService
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.layers.Layer import Layer, LayerId, LayerPropertyName
from ....types.permissions.Privilege import Privilege
from ....types.Project import ProjectId


class ImageOutputFormat(StrEnum):
    raster = 'raster'
    raster_colorbar = 'raster_colorbar'
    grid = 'grid'
    grid_colorbar = 'grid_colorbar'

    @classmethod
    def _missing_(cls, value):
        return cls.raster


class ReadModelLayerPropertyImageRequestHandler:
    def handle(self, project_id: ProjectId, layer_id: LayerId, property_name: LayerPropertyName, output_format: ImageOutputFormat):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            model = ModelReader().get_latest_model(project_id)
        except InsufficientPermissionsException as e:
            return str(e), 403
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404

        layer = model.layers.get_layer(layer_id)
        if not isinstance(layer, Layer):
            return {'message': 'Layer not found'}, 404

        property_value = layer.get_property_values(property_name)
        if property_value is None:
            return {'message': 'Property not found'}, 404

        data = property_value.get_data()  # type: ignore
        image_creation_service = ImageCreationService()

        if output_format == ImageOutputFormat.grid:
            no_data_value = -9999.0

            raster_interpolator = RasterInterpolationService()
            grid = model.spatial_discretization.grid

            target_resolution_x = grid.n_cols() * 5 if grid.n_cols() < 200 else grid.n_cols()

            result_data = raster_interpolator.grid_data_to_grid_data_with_equal_cells(grid=grid, data=data, target_resolution_x=target_resolution_x, no_data_value=no_data_value)

            image = image_creation_service.create_image_from_data(data=result_data, cmap='jet_r', no_data_value=no_data_value)
            return send_file(image, mimetype='image/png', max_age=0)

        if output_format == ImageOutputFormat.grid_colorbar:
            image = image_creation_service.create_colorbar_from_data(data=data, cmap='jet_r', no_data_value=-9999.0)
            return send_file(image, mimetype='image/png', max_age=0)

        if output_format == ImageOutputFormat.raster:
            raster_interpolator = RasterInterpolationService()
            grid = model.spatial_discretization.grid
            target_resolution_x = grid.n_cols() * 5 if grid.n_cols() < 200 else grid.n_cols()
            cartesian_grid = grid.to_cartesian_grid(n_cols=target_resolution_x)

            result_data = raster_interpolator.grid_to_grid(source_grid=grid, target_grid=cartesian_grid, source_data=data, method=InterpolationMethod.linear, no_data_value=None)

            image = image_creation_service.create_image_from_data(data=result_data, cmap='jet_r', no_data_value=None)
            return send_file(image, mimetype='image/png', max_age=0)

        if output_format == ImageOutputFormat.raster_colorbar:
            image = image_creation_service.create_colorbar_from_data(data=data, cmap='jet_r', no_data_value=-9999.0)
            return send_file(image, mimetype='image/png', max_age=0)

        return {'message': f'Invalid output format: {output_format}, valid options are {ImageOutputFormat.__members__.keys()}'}, 400
