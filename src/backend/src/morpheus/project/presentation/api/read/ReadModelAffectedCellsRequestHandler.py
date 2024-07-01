from typing import Literal

from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException
from ....application.read.ModelReader import ModelReader
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.Project import ProjectId
from ....types.permissions.Privilege import Privilege

format_type = Literal['json', 'geojson', 'geojson_outline'] | str


class ReadModelAffectedCellsRequestHandler:
    def handle(self, project_id: ProjectId, format: format_type = 'json'):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            model = ModelReader().get_latest_model(project_id)
            spatial_discretization = model.spatial_discretization

            if spatial_discretization is None:
                raise NotFoundException('Spatial discretization not found')

            affected_cells = spatial_discretization.affected_cells
            if affected_cells is None:
                raise NotFoundException('Affected cells not found')

            grid = spatial_discretization.grid
            if grid is None:
                raise NotFoundException('Grid not found')

            if format == 'geojson':
                return affected_cells.to_geojson(grid=grid).as_geojson(), 200

            if format == 'geojson_outline':
                return affected_cells.outline_to_geojson(grid=grid).as_geojson(), 200

            return affected_cells.to_dict(), 200
        except InsufficientPermissionsException as e:
            return str(e), 403
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404
        except NotFoundException as e:
            return {'message': str(e)}, 404
