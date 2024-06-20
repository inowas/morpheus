from flask import abort

from morpheus.common.types.Exceptions import NotFoundException

from ....incoming import get_identity
from ....application.read.PermissionsReader import get_permissions_reader
from ....types.Project import ProjectId
from ....types.User import UserId


class ReadPermissionsRequestHandler:
    def handle(self, project_id: ProjectId):

        identity = get_identity()
        if identity is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(identity.user_id.to_str())

        permissions_reader = get_permissions_reader()

        try:
            permissions = permissions_reader.get_permissions(project_id)
        except NotFoundException:
            return {'message': 'Project not found'}, 404

        return {
            'is_owner': permissions.member_is_owner(user_id),
            'can_manage': permissions.member_can_manage(user_id),
            'can_edit': permissions.member_can_edit(user_id),
            'can_view': permissions.member_can_view(user_id)
        }, 200
