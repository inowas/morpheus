from typing import Literal

from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException

from ....application.read.ModelReader import ModelReader
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.boundaries.Boundary import BoundaryId
from ....types.permissions.Privilege import Privilege
from ....types.Project import ProjectId


class ReadModelBoundaryAffectedCellsRequestHandler:
    def handle(self, project_id: ProjectId, boundary_id: BoundaryId, format: Literal['json', 'geojson', 'geojson_outline'] | str = 'json'):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            model = ModelReader().get_latest_model(project_id)
            spatial_discretization = model.spatial_discretization
            if spatial_discretization is None:
                raise NotFoundException('Spatial discretization not found')

            boundary = model.boundaries.get_boundary(boundary_id)
            if boundary is None:
                raise NotFoundException(f'Boundary with id {boundary_id.to_str()} not found')

            affected_cells = boundary.affected_cells
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
        except NotFoundException as e:
            return {'message': str(e)}, 404
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404
