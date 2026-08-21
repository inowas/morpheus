from morpheus.common.presentation.api.helpers.file_upload import remove_uploaded_file
from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException

from .....application.read.PermissionsReader import permissions_reader
from .....application.write.AssetCommandHandlers import (
    UpdatePreviewImageCommand,
    UpdatePreviewImageCommandHandler,
)
from .....incoming import get_identity
from .....types.Asset import AssetId
from .....types.Exceptions import InvalidMimeTypeException
from .....types.permissions.Privilege import Privilege
from .....types.Project import ProjectId


class UploadPreviewImageRequestHandler:
    @staticmethod
    def handle(project_id: ProjectId, file_name, file_path):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.EDIT_PROJECT, identity, project_id)
            command = UpdatePreviewImageCommand(asset_id=AssetId.new(), project_id=project_id, file_name=file_name, file_path=file_path, updated_by=identity.user_id)
            UpdatePreviewImageCommandHandler.handle(command)
        except NotFoundException as e:
            return str(e), 404
        except InsufficientPermissionsException as e:
            return str(e), 403
        except InvalidMimeTypeException as e:
            return str(e), 422
        finally:
            remove_uploaded_file(file_path)

        return '', 204
