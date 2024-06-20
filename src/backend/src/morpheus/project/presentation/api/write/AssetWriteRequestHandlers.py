from flask import abort, request, Response

from morpheus.common.presentation.api.helpers.file_upload import remove_uploaded_file, move_uploaded_files_to_tmp_dir
from morpheus.common.types.Exceptions import NotFoundException, InsufficientPermissionsException
from morpheus.common.types.identity.Identity import UserId
from ....application.write.AssetCommandHandlers import UpdatePreviewImageCommand, UpdatePreviewImageCommandHandler, DeletePreviewImageCommand, DeletePreviewImageCommandHandler, \
    UploadAssetCommand, UploadAssetCommandHandler
from ....incoming import get_identity
from ....types.Asset import AssetId, AssetDescription
from ....types.Exceptions import InvalidMimeTypeException, InvalidShapefileException, InvalidGeoTiffException
from ....types.Project import ProjectId


class UploadPreviewImageRequestHandler:
    @staticmethod
    def handle(project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            abort(401, 'Unauthorized')

        if not request.mimetype == 'multipart/form-data':
            abort(415, 'Request body must multipart/form-data')

        file_name, file_path = move_uploaded_files_to_tmp_dir('file', 1)[0]

        try:
            command = UpdatePreviewImageCommand(
                asset_id=AssetId.new(),
                project_id=project_id,
                file_name=file_name,
                file_path=file_path,
                updated_by=identity.user_id
            )
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


class DeletePreviewImageRequestHandler:
    @staticmethod
    def handle(project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            abort(401, 'Unauthorized')

        command = DeletePreviewImageCommand(
            project_id=project_id,
            updated_by=identity.user_id
        )

        try:
            DeletePreviewImageCommandHandler.handle(command)
        except NotFoundException as e:
            abort(404, str(e))
        except InsufficientPermissionsException as e:
            abort(403, str(e))

        return '', 204


class UploadAssetRequestHandler:
    @staticmethod
    def handle(project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            abort(401, 'Unauthorized')

        if not request.mimetype == 'multipart/form-data':
            abort(415, 'Request body must multipart/form-data')

        file_name, file_path = move_uploaded_files_to_tmp_dir('file', 1)[0]

        try:
            command = UploadAssetCommand(
                asset_id=AssetId.new(),
                project_id=project_id,
                file_name=file_name,
                file_path=file_path,
                description=AssetDescription.try_from_str(request.form.get('description')),
                updated_by=identity.user_id
            )
            UploadAssetCommandHandler.handle(command)

            return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/assets/{command.asset_id.to_str()}'})

        except (InvalidMimeTypeException, InvalidGeoTiffException, InvalidShapefileException) as e:
            abort(422, str(e))
        except NotFoundException as e:
            abort(404, str(e))
        except InsufficientPermissionsException as e:
            abort(403, str(e))
        finally:
            remove_uploaded_file(file_path)
