from typing import Literal

from ....application.read.ModelReader import ModelReader
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.Project import ProjectId


class ReadModelGridRequestHandler:
    def handle(self, project_id: ProjectId, format: Literal['json', 'geojson'] | str):
        model_reader = ModelReader()

        try:
            model = model_reader.get_latest_model(project_id)
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404

        spatial_discretization = model.spatial_discretization

        if spatial_discretization is None:
            return {'message': 'Spatial discretization not found'}, 404

        grid = spatial_discretization.grid

        if grid is None:
            return {'message': 'Grid not found'}, 404

        if format == 'geojson':
            return grid.to_geojson().__geo_interface__(), 200

        return grid.to_dict(), 200
