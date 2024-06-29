from flask import abort
from morpheus.common.types.Exceptions import NotFoundException, InsufficientPermissionsException
from ....incoming import get_identity
from ....application.read.PermissionsReader import permissions_reader
from ....types.Project import ProjectId
from ....types.permissions.Privilege import Privilege


class ReadPrivilegesRequestHandler:
    def handle(self, project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            abort(401, 'Unauthorized')
        user_id = identity.user_id

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            privileges = permissions_reader.get_privileges_for_identity(identity, project_id)

            return [privilege.value for privilege in privileges], 200
        except InsufficientPermissionsException as e:
            abort(403, str(e))
        except NotFoundException:
            return {'message': 'Project not found'}, 404
