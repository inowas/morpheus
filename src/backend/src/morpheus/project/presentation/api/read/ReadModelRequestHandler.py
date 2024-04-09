from ....application.read.ModelReader import ModelReader
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.Project import ProjectId


class ReadModelRequestHandler:
    def handle(self, project_id: ProjectId):
        model_reader = ModelReader()

        try:
            model = model_reader.get_latest_model(project_id)
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404

        return {
            'model_id': model.model_id.to_str(),
        }
