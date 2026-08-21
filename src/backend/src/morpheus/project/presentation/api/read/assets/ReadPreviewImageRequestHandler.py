from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.project.application.read.AssetReader import get_asset_reader
from morpheus.project.application.read.ProjectReader import project_reader
from morpheus.project.infrastructure.assets.AssetHandlingService import asset_handling_service
from morpheus.project.types.Project import ProjectId


class ReadPreviewImageRequestHandler:
    @staticmethod
    def handle(project_id: ProjectId):
        # for now without authentication (see https://redmine.junghanns.it/issues/2388)
        # identity = get_identity()
        # if identity is None:
        #     return '', 401

        if not project_reader.project_exists(project_id):
            return '', 404

        try:
            # for now without authentication (see https://redmine.junghanns.it/issues/2388)
            # permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            asset_reader = get_asset_reader()
            preview_image_asset = asset_reader.get_preview_image(project_id)
            if preview_image_asset is None:
                return 'morpheus/project/resources/default_preview_image.png', 'image/png', None

            return asset_handling_service.get_full_path_to_asset(preview_image_asset), preview_image_asset.file.mime_type, preview_image_asset.file.file_name
        except InsufficientPermissionsException as e:
            return str(e), 403
