from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException

from .....application.read.PermissionsReader import permissions_reader
from .....application.write.AssetCommandHandlers import (
    DeletePreviewImageCommand,
    DeletePreviewImageCommandHandler,
)
from .....incoming import get_identity
from .....types.permissions.Privilege import Privilege
from .....types.Project import ProjectId


class DeletePreviewImageRequestHandler:
    @staticmethod
    def handle(project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.EDIT_PROJECT, identity, project_id)
            DeletePreviewImageCommandHandler.handle(DeletePreviewImageCommand(project_id=project_id, updated_by=identity.user_id))
        except NotFoundException as e:
            return str(e), 404
        except InsufficientPermissionsException as e:
            return str(e), 403

        return '', 204
