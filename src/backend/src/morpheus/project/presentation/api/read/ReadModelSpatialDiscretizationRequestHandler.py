from ....application.read.ModelReader import ModelReader
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.Project import ProjectId


class ReadModelSpatialDiscretizationRequestHandler:
    def handle(self, project_id: ProjectId):
        model_reader = ModelReader()

        try:
            model = model_reader.get_latest_model(project_id)
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404

        spatial_discretization = model.spatial_discretization

        if spatial_discretization is None:
            return {'message': 'Spatial discretization not found'}, 404

        return spatial_discretization.to_dict(), 200
