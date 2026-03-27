from flask import abort, request

from morpheus.common.presentation.api.helpers.file_upload import move_uploaded_files_to_tmp_dir, remove_uploaded_file
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
    def handle(project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            abort(401, 'Unauthorized')

        if request.mimetype != 'multipart/form-data':
            abort(415, 'Request body must multipart/form-data')

        file_name, file_path = move_uploaded_files_to_tmp_dir('file', 1)[0]

        try:
            permissions_reader.assert_identity_can(Privilege.EDIT_PROJECT, identity, project_id)
            command = UpdatePreviewImageCommand(asset_id=AssetId.new(), project_id=project_id, file_name=file_name, file_path=file_path, updated_by=identity.user_id)
            UpdatePreviewImageCommandHandler.handle(command)
        except NotFoundException as e:
            abort(404, str(e))
        except InsufficientPermissionsException as e:
            abort(403, str(e))
        except InvalidMimeTypeException as e:
            abort(422, str(e))
        finally:
            remove_uploaded_file(file_path)

        return '', 204
