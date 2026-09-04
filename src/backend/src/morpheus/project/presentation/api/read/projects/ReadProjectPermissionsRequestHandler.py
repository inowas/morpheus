from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException
from morpheus.project.application.read.PermissionsReader import permissions_reader
from morpheus.project.incoming import get_identity
from morpheus.project.types.permissions.Privilege import Privilege
from morpheus.project.types.Project import ProjectId


class ReadProjectPermissionsRequestHandler:
    def handle(self, project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.MANAGE_PROJECT, identity, project_id)
            permissions = permissions_reader.get_permissions(project_id)

            return permissions.to_dict(), 200
        except InsufficientPermissionsException as e:
            return str(e), 403
        except NotFoundException:
            return {'message': 'Project not found'}, 404
