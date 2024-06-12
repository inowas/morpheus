from typing import Literal
from ....application.read.ModelReader import ModelReader
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.Project import ProjectId
from ....types.boundaries.Boundary import BoundaryId


class ReadModelBoundaryAffectedCellsRequestHandler:
    def handle(self, project_id: ProjectId, boundary_id: BoundaryId, format: Literal['json', 'geojson', 'geojson_outline'] | str = 'json'):
        model_reader = ModelReader()

        try:
            model = model_reader.get_latest_model(project_id)
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404

        spatial_discretization = model.spatial_discretization
        if spatial_discretization is None:
            return {'message': 'Spatial discretization not found'}, 404

        boundary = model.boundaries.get_boundary(boundary_id)
        if boundary is None:
            return {'message': 'Boundary not found'}, 404

        affected_cells = boundary.affected_cells
        if affected_cells is None:
            return {'message': 'Affected cells not found'}, 404

        grid = spatial_discretization.grid

        if grid is None:
            return {'message': 'Grid not found'}, 404

        if format == 'geojson':
            return affected_cells.to_geojson(grid=grid).as_geojson(), 200

        if format == 'geojson_outline':
            return affected_cells.outline_to_geojson(grid=grid).as_geojson(), 200

        return affected_cells.to_dict(), 200
