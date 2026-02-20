from typing import Literal

from morpheus.common.types.Exceptions import NotFoundException

from ....application.read.ModelReader import ModelReader
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.permissions.Privilege import Privilege
from ....types.Project import ProjectId


class ReadModelGridRequestHandler:
    def handle(self, project_id: ProjectId, format: Literal['json', 'geojson'] | str):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            model = ModelReader().get_latest_model(project_id)
            spatial_discretization = model.spatial_discretization
            if spatial_discretization is None:
                raise NotFoundException('Spatial discretization not found')

            grid = spatial_discretization.grid
            if grid is None:
                raise NotFoundException('Grid not found')

            if format == 'geojson':
                return grid.to_geojson().__geo_interface__(), 200

            return grid.to_dict(), 200
        except NotFoundException as e:
            return {'message': str(e)}, 404
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404
