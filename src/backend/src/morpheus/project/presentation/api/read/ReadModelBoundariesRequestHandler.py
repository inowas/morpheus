from morpheus.common.types.Exceptions import NotFoundException, InsufficientPermissionsException
from ....application.read.ModelReader import ModelReader
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.Project import ProjectId
from ....types.boundaries.Boundary import BoundaryId, Boundary
from ....types.permissions.Privilege import Privilege


class ReadModelBoundariesRequestHandler:
    def handle(self, project_id: ProjectId, boundary_id: BoundaryId | None = None):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            model = ModelReader().get_latest_model(project_id)

            boundaries = model.boundaries
            if boundaries is None:
                raise NotFoundException('Boundaries not found')

            # return a single boundary if boundary_id is provided
            if isinstance(boundary_id, BoundaryId):
                boundary = boundaries.get_boundary(boundary_id)
                if isinstance(boundary, Boundary):
                    return boundary.to_dict(), 200
                raise NotFoundException(f'Boundary with id {boundary_id.to_str()} not found')

            # return all boundaries
            return boundaries.to_dict(), 200
        except InsufficientPermissionsException as e:
            return str(e), 403
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404
        except NotFoundException as e:
            return {'message': str(e)}, 404
