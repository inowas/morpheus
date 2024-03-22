from flask import send_file, Response

from morpheus.project.infrastructure.assets.AssetHandlingService import asset_handling_service
from morpheus.project.types.Asset import Asset


def asset_file_response(asset: Asset) -> Response:
    return send_file(asset_handling_service.get_full_path_to_asset(asset), mimetype=asset.file.mimetype)


def default_preview_image_response() -> Response:
    return send_file('morpheus/project/resources/default_preview_image.png', mimetype='image/png')
