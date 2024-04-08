from ....application.read.ModelReader import ModelReader
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.Project import ProjectId


class ReadModelBoundariesRequestHandler:
    def handle(self, project_id: ProjectId):
        model_reader = ModelReader()

        try:
            model = model_reader.get_latest_model(project_id)
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404

        boundaries = model.boundaries

        if boundaries is None:
            return {'message': 'Boundaries not found'}, 404

        return boundaries.to_dict(), 200
