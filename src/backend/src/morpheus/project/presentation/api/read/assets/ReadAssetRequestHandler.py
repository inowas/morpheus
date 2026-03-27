from morpheus.project.application.read.AssetReader import get_asset_reader
from morpheus.project.application.read.PermissionsReader import permissions_reader
from morpheus.project.application.read.ProjectReader import project_reader
from morpheus.project.exceptions import InsufficientPermissionsException
from morpheus.project.incoming import get_identity
from morpheus.project.types.Asset import AssetId
from morpheus.project.types.permissions.Privilege import Privilege
from morpheus.project.types.Project import ProjectId


class ReadAssetRequestHandler:
    @staticmethod
    def handle(project_id: ProjectId, asset_id: AssetId):
        identity = get_identity()
        if identity is None:
            return '', 401

        if not project_reader.project_exists(project_id):
            return '', 404

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            asset_reader = get_asset_reader()
            asset = asset_reader.get_asset(project_id, asset_id)
            if asset is None:
                return '', 404

            return asset.to_dict(), 200
        except InsufficientPermissionsException as e:
            return str(e), 403
