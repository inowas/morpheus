from flask import Blueprint, request, send_file
from flask_cors import cross_origin

from ...common.presentation.api.middleware.schema_validation import validate_request
from ..incoming import authenticate
from ..presentation.api.read.assets.DownloadAssetRequestHandler import DownloadAssetRequestHandler
from ..presentation.api.read.assets.ReadAssetDataRequestHandler import ReadAssetDataRequestHandler
from ..presentation.api.read.assets.ReadAssetListRequestHandler import ReadAssetListRequestHandler
from ..presentation.api.read.assets.ReadAssetRequestHandler import ReadAssetRequestHandler
from ..presentation.api.read.assets.ReadPreviewImageRequestHandler import ReadPreviewImageRequestHandler
from ..presentation.api.write.assets.DeletePreviewImageRequestHandler import DeletePreviewImageRequestHandler
from ..presentation.api.write.assets.UploadAssetRequestHandler import UploadAssetRequestHandler
from ..presentation.api.write.assets.UploadPreviewImageRequestHandler import UploadPreviewImageRequestHandler
from ..types.Asset import AssetId
from ..types.Project import ProjectId


def register_routes(blueprint: Blueprint):
    """Register asset-related routes."""

    @blueprint.route('/<project_id>/assets', methods=['POST'])
    @cross_origin(expose_headers='Location')
    @authenticate()
    @validate_request
    def upload_project_asset(project_id: str):
        return UploadAssetRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/assets', methods=['GET'])
    @cross_origin()
    @authenticate()
    @validate_request
    def project_assets(project_id: str):
        return ReadAssetListRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/assets/<asset_id>', methods=['GET'])
    @cross_origin()
    @authenticate()
    @validate_request
    def project_asset(project_id: str, asset_id: str):
        return ReadAssetRequestHandler().handle(project_id=ProjectId.from_str(project_id), asset_id=AssetId.from_str(asset_id))

    @blueprint.route('/<project_id>/assets/<asset_id>/file', methods=['GET'])
    @cross_origin()
    @authenticate()
    @validate_request
    def download_project_asset(project_id: str, asset_id: str):
        result = DownloadAssetRequestHandler().handle(project_id=ProjectId.from_str(project_id), asset_id=AssetId.from_str(asset_id))
        if isinstance(result, tuple) and len(result) == 3:
            return send_file(result[0], mimetype=result[1], download_name=result[2])
        return result

    @blueprint.route('/<project_id>/assets/<asset_id>/data', methods=['GET'])
    @cross_origin()
    @authenticate()
    @validate_request
    def project_asset_data(project_id: str, asset_id: str):
        band = request.args.get('band', None)
        return ReadAssetDataRequestHandler().handle(project_id=ProjectId.from_str(project_id), asset_id=AssetId.from_str(asset_id), band=int(band) if band is not None else None)

    @blueprint.route('/<project_id>/preview_image', methods=['PUT'])
    @cross_origin()
    @authenticate()
    def project_preview_image_upload(project_id: str):
        return UploadPreviewImageRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/preview_image', methods=['GET'])
    @cross_origin()
    # for now without authentication (see https://redmine.junghanns.it/issues/2388)
    # @authenticate()
    @validate_request
    def project_preview_image_fetch(project_id: str):
        result = ReadPreviewImageRequestHandler().handle(project_id=ProjectId.from_str(project_id))
        if isinstance(result, tuple) and len(result) == 3:
            return send_file(result[0], mimetype=result[1], download_name=result[2])
        return result

    @blueprint.route('/<project_id>/preview_image', methods=['DELETE'])
    @cross_origin()
    @authenticate()
    @validate_request
    def project_preview_image_deletion(project_id: str):
        return DeletePreviewImageRequestHandler().handle(project_id=ProjectId.from_str(project_id))
