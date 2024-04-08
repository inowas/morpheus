from flask import abort, request
from morpheus.common.presentation.api.helpers.file_upload import remove_uploaded_file, move_uploaded_files_to_tmp_dir
from morpheus.common.types.Exceptions import NotFoundException, InsufficientPermissionsException
from morpheus.common.types.File import FileName
from ....application.write.AssetCommandHandlers import UpdatePreviewImageCommand, UpdatePreviewImageCommandHandler, DeletePreviewImageCommand, DeletePreviewImageCommandHandler, \
    UploadAssetCommand, UploadAssetCommandHandler, DeleteAssetCommand, DeleteAssetCommandHandler, UpdateAssetCommand, UpdateAssetCommandHandler
from ....incoming import get_logged_in_user_id
from ....types.Asset import AssetId, AssetDescription
from ....types.Exceptions import InvalidMimeTypeException, InvalidShapefileException, InvalidGeoTiffException, InvalidFileNameException
from ....types.Project import ProjectId
from ....types.User import UserId


class UploadPreviewImageRequestHandler:
    @staticmethod
    def handle(project_id_url_parameter: str):
        user_id = UserId.try_from_str(get_logged_in_user_id())
        if user_id is None:
            abort(401, 'Unauthorized')

        if not request.mimetype == 'multipart/form-data':
            abort(415, 'Request body must multipart/form-data')

        file_name, file_path = move_uploaded_files_to_tmp_dir('file', 1)[0]

        try:
            command = UpdatePreviewImageCommand(
                asset_id=AssetId.new(),
                project_id=ProjectId.from_str(project_id_url_parameter),
                file_name=file_name,
                file_path=file_path,
                updated_by=user_id
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
    def handle(project_id_url_parameter: str):
        user_id = UserId.try_from_str(get_logged_in_user_id())
        if user_id is None:
            abort(401, 'Unauthorized')

        command = DeletePreviewImageCommand(
            project_id=ProjectId.from_str(project_id_url_parameter),
            updated_by=user_id
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
    def handle(project_id_url_parameter: str):
        user_id = UserId.try_from_str(get_logged_in_user_id())
        if user_id is None:
            abort(401, 'Unauthorized')

        if not request.mimetype == 'multipart/form-data':
            abort(415, 'Request body must multipart/form-data')

        file_name, file_path = move_uploaded_files_to_tmp_dir('file', 1)[0]

        try:
            command = UploadAssetCommand(
                asset_id=AssetId.new(),
                project_id=ProjectId.from_str(project_id_url_parameter),
                file_name=file_name,
                file_path=file_path,
                description=AssetDescription.try_from_str(request.form.get('description')),
                updated_by=user_id
            )
            UploadAssetCommandHandler.handle(command)
        except (InvalidMimeTypeException, InvalidGeoTiffException, InvalidShapefileException) as e:
            abort(422, str(e))
        except NotFoundException as e:
            abort(404, str(e))
        except InsufficientPermissionsException as e:
            abort(403, str(e))
        finally:
            remove_uploaded_file(file_path)

        return '', 201, {'location': f'projects/{command.project_id.to_str()}/assets/{command.asset_id.to_str()}'}


class DeleteAssetRequestHandler:
    @staticmethod
    def handle(project_id_url_parameter: str, asset_id_url_parameter: str):
        user_id = UserId.try_from_str(get_logged_in_user_id())
        if user_id is None:
            abort(401, 'Unauthorized')

        command = DeleteAssetCommand(
            project_id=ProjectId.from_str(project_id_url_parameter),
            asset_id=AssetId.from_str(asset_id_url_parameter),
        )
        try:
            DeleteAssetCommandHandler.handle(command)
        except NotFoundException as e:
            abort(404, str(e))
        except InsufficientPermissionsException as e:
            abort(403, str(e))

        return '', 204


class UpdateAssetRequestHandler:
    @staticmethod
    def handle(project_id_url_parameter: str, asset_id_url_parameter: str):
        user_id = UserId.try_from_str(get_logged_in_user_id())
        if user_id is None:
            abort(401, 'Unauthorized')

        if not request.is_json or request.json is None:
            abort(415, 'Request body must be JSON')

        description = request.json.get('description')
        file_name = request.json.get('file_name')

        try:
            command = UpdateAssetCommand(
                project_id=ProjectId.from_str(project_id_url_parameter),
                asset_id=AssetId.from_str(asset_id_url_parameter),
                description=AssetDescription.try_from_str(description),
                file_name=FileName(file_name) if file_name is not None else None,
            )
            UpdateAssetCommandHandler.handle(command)
        except InvalidFileNameException as e:
            abort(422, str(e))
        except NotFoundException as e:
            abort(404, str(e))
        except InsufficientPermissionsException as e:
            abort(403, str(e))

        return '', 204
