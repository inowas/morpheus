from ....application.read.ModelReader import ModelReader
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.Project import ProjectId
from ....types.boundaries.Boundary import BoundaryId, Boundary


class ReadModelBoundariesRequestHandler:
    def handle(self, project_id: ProjectId, boundary_id: BoundaryId | None = None):
        model_reader = ModelReader()

        try:
            model = model_reader.get_latest_model(project_id)
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404

        boundaries = model.boundaries

        if boundaries is None:
            return {'message': 'Boundaries not found'}, 404

        # return a single boundary if boundary_id is provided
        if isinstance(boundary_id, BoundaryId):
            boundary = boundaries.get_boundary(boundary_id)
            if isinstance(boundary, Boundary):
                return boundary.to_dict(), 200
            return {'message': 'Boundary not found'}, 404

        # return all boundaries
        return boundaries.to_dict(), 200
