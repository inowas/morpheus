from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException
from morpheus.project.application.read.PermissionsReader import permissions_reader
from morpheus.project.incoming import get_identity
from morpheus.project.types.permissions.Privilege import Privilege
from morpheus.project.types.Project import ProjectId


class ReadProjectPrivilegesRequestHandler:
    def handle(self, project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            privileges = permissions_reader.get_privileges_for_identity(identity, project_id)

            return [privilege.value for privilege in privileges], 200
        except InsufficientPermissionsException as e:
            return str(e), 403
        except NotFoundException:
            return {'message': 'Project not found'}, 404
