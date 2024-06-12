from typing import Literal

from ....application.read.ModelReader import ModelReader
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.Project import ProjectId

format_type = Literal['json', 'geojson', 'geojson_outline'] | str


class ReadModelAffectedCellsRequestHandler:
    def handle(self, project_id: ProjectId, format: format_type = 'json'):
        model_reader = ModelReader()

        try:
            model = model_reader.get_latest_model(project_id)
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404

        spatial_discretization = model.spatial_discretization

        if spatial_discretization is None:
            return {'message': 'Spatial discretization not found'}, 404

        affected_cells = spatial_discretization.affected_cells

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
