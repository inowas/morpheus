from morpheus.common.presentation.api.helpers.file_upload import remove_uploaded_file
from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException

from .....application.read.PermissionsReader import permissions_reader
from .....application.write.AssetCommandHandlers import (
    UploadAssetCommand,
    UploadAssetCommandHandler,
)
from .....incoming import get_identity
from .....types.Asset import AssetDescription, AssetId
from .....types.Exceptions import InvalidGeoTiffException, InvalidMimeTypeException, InvalidShapefileException
from .....types.permissions.Privilege import Privilege
from .....types.Project import ProjectId


class UploadAssetRequestHandler:
    @staticmethod
    def handle(project_id: ProjectId, file_name, file_path, description):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.EDIT_PROJECT, identity, project_id)
            command = UploadAssetCommand(
                asset_id=AssetId.new(),
                project_id=project_id,
                file_name=file_name,
                file_path=file_path,
                description=AssetDescription.try_from_str(description),
            )
            UploadAssetCommandHandler.handle(command)

            return {'location': f'projects/{command.project_id.to_str()}/assets/{command.asset_id.to_str()}'}, 201

        except (InvalidMimeTypeException, InvalidGeoTiffException, InvalidShapefileException) as e:
            return str(e), 422
        except NotFoundException as e:
            return str(e), 404
        except InsufficientPermissionsException as e:
            return str(e), 403
        finally:
            remove_uploaded_file(file_path)
