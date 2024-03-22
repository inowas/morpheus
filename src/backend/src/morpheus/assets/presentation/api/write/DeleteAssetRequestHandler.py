from flask import Request, abort, jsonify

from morpheus.assets.application.read.AssetReader import asset_reader
from morpheus.assets.application.write.AssetCommandHandlers import UploadAssetCommand, UploadAssetCommandHandler, DeleteAssetCommand, DeleteAssetCommandHandler
from morpheus.assets.incoming import get_logged_in_user_id
from morpheus.assets.types.Asset import AssetId



class DeleteAssetRequestHandler:
    @staticmethod
    def handle(asset_id: str):
        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        #  todo: user has permission for asset
        # abort(403, 'Forbidden')


        asset_id = AssetId.from_str(asset_id)


        if not asset_reader.has_asset(asset_id):
            abort(404, 'Not Found')

        command = DeleteAssetCommand(asset_id=asset_id)
        DeleteAssetCommandHandler.handle(command)

        response = jsonify()
        response.status_code = 204

        return response
