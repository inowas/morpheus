from flask import Request, Response, send_file

from morpheus.common.types.File import FileName
from morpheus.project.infrastructure.assets.AssetHandlingService import asset_handling_service
from morpheus.project.types.Asset import Asset, AssetDescription, AssetFilter, AssetType
from morpheus.project.types.Project import ProjectId


def asset_file_response(asset: Asset) -> Response:
    return send_file(asset_handling_service.get_full_path_to_asset(asset), mimetype=asset.file.mime_type, download_name=asset.file.file_name)


def default_preview_image_response() -> Response:
    return send_file('morpheus/project/resources/default_preview_image.png', mimetype='image/png')


def create_filter_for_asset_list(project_id: ProjectId, request: Request) -> AssetFilter:
    asset_type_or_none = request.args.get('asset_type', default=None, type=str)
    file_name_or_none = request.args.get('file_name', default=None, type=str)
    description_or_none = request.args.get('description', default=None, type=str)

    if asset_type_or_none is not None:
        asset_type_or_none = asset_type_or_none.strip()
        if len(asset_type_or_none) == 0:
            asset_type_or_none = None
    if file_name_or_none is not None:
        file_name_or_none = file_name_or_none.strip()
        if len(file_name_or_none) == 0:
            file_name_or_none = None
    if description_or_none is not None:
        description_or_none = description_or_none.strip()
        if len(description_or_none) == 0:
            description_or_none = None

    return AssetFilter(
        project_id=project_id,
        asset_type=[AssetType(asset_type_or_none)] if asset_type_or_none is not None else [AssetType.GEO_TIFF, AssetType.SHAPEFILE],
        file_name=FileName(file_name_or_none) if file_name_or_none is not None else None,
        description=AssetDescription.try_from_str(description_or_none),
    )
