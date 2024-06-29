from morpheus.common.types.Exceptions import InsufficientPermissionsException
from ....application.read.ModelReader import ModelReader
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.Project import ProjectId
from ....types.permissions.Privilege import Privilege


class ReadModelSpatialDiscretizationRequestHandler:
    def handle(self, project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            model = ModelReader().get_latest_model(project_id)
        except InsufficientPermissionsException as e:
            return str(e), 403
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404

        spatial_discretization = model.spatial_discretization

        if spatial_discretization is None:
            return {'message': 'Spatial discretization not found'}, 404

        return spatial_discretization.to_dict(), 200
