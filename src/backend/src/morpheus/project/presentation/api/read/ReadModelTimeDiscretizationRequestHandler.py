from ....application.read.ModelReader import ModelReader
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.Project import ProjectId


class ReadModelTimeDiscretizationRequestHandler:
    def handle(self, project_id: ProjectId):
        model_reader = ModelReader()

        try:
            model = model_reader.get_latest_model(project_id)
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404

        time_discretization = model.time_discretization

        if time_discretization is None:
            return {'message': 'Time discretization not found'}, 404

        return time_discretization.to_dict(), 200
