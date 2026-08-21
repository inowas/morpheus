from typing import Annotated

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from morpheus.fastapi_auth import IdentityDependency
from morpheus.project.presentation.api.read.assets.DownloadAssetRequestHandler import DownloadAssetRequestHandler
from morpheus.project.presentation.api.read.assets.ReadAssetDataRequestHandler import ReadAssetDataRequestHandler
from morpheus.project.presentation.api.read.assets.ReadAssetListRequestHandler import ReadAssetListRequestHandler
from morpheus.project.presentation.api.read.assets.ReadAssetRequestHandler import ReadAssetRequestHandler
from morpheus.project.presentation.api.read.assets.ReadPreviewImageRequestHandler import ReadPreviewImageRequestHandler
from morpheus.project.types.Asset import AssetId
from morpheus.project.types.Project import ProjectId

router = APIRouter(prefix='/projects', tags=['Assets'])


def _result(result):
    if not isinstance(result, tuple):
        return result

    if len(result) == 3:
        return result

    payload, status_code = result
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=payload or 'Request failed')
    return payload


@router.get('/{project_id}/assets', operation_id='read_assets')
def read_assets(
    project_id: str,
    _: IdentityDependency,
    asset_type: Annotated[str | None, Query()] = None,
    file_name: Annotated[str | None, Query()] = None,
    description: Annotated[str | None, Query()] = None,
    page: Annotated[int | None, Query(ge=1)] = None,
    page_size: Annotated[int | None, Query(ge=1)] = None,
):
    return _result(
        ReadAssetListRequestHandler.handle(
            ProjectId.from_str(project_id), asset_type, file_name, description, page, page_size
        )
    )


@router.get('/{project_id}/assets/{asset_id}', operation_id='read_asset')
def read_asset(project_id: str, asset_id: str, _: IdentityDependency):
    return _result(ReadAssetRequestHandler.handle(ProjectId.from_str(project_id), AssetId.from_str(asset_id)))


@router.get('/{project_id}/assets/{asset_id}/file', operation_id='download_asset')
def download_asset(project_id: str, asset_id: str, _: IdentityDependency):
    result = _result(DownloadAssetRequestHandler.handle(ProjectId.from_str(project_id), AssetId.from_str(asset_id)))
    path, media_type, file_name = result
    return FileResponse(path, media_type=media_type, filename=file_name)


@router.get('/{project_id}/assets/{asset_id}/data', operation_id='read_asset_data')
def read_asset_data(
    project_id: str,
    asset_id: str,
    _: IdentityDependency,
    band: Annotated[int | None, Query()] = None,
):
    return _result(ReadAssetDataRequestHandler.handle(ProjectId.from_str(project_id), AssetId.from_str(asset_id), band))


@router.get('/{project_id}/preview_image', operation_id='read_preview_image')
def read_preview_image(project_id: str):
    result = ReadPreviewImageRequestHandler.handle(ProjectId.from_str(project_id))
    if isinstance(result, tuple) and len(result) == 3:
        path, media_type, file_name = result
        return FileResponse(path, media_type=media_type, filename=file_name)
    return _result(result)
