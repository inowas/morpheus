from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, Query, Request, UploadFile
from fastapi.responses import FileResponse, JSONResponse

from morpheus.common.presentation.api.helpers.file_upload import save_uploaded_file
from morpheus.fastapi_auth import IdentityDependency
from morpheus.fastapi_contract import FULL_READ_RESPONSES, UPLOAD_RESPONSES
from morpheus.project.presentation.api.read.assets.DownloadAssetRequestHandler import DownloadAssetRequestHandler
from morpheus.project.presentation.api.read.assets.ReadAssetDataRequestHandler import ReadAssetDataRequestHandler
from morpheus.project.presentation.api.read.assets.ReadAssetListRequestHandler import ReadAssetListRequestHandler
from morpheus.project.presentation.api.read.assets.ReadAssetRequestHandler import ReadAssetRequestHandler
from morpheus.project.presentation.api.read.assets.ReadPreviewImageRequestHandler import ReadPreviewImageRequestHandler
from morpheus.project.presentation.api.write.assets.DeletePreviewImageRequestHandler import DeletePreviewImageRequestHandler
from morpheus.project.presentation.api.write.assets.UploadAssetRequestHandler import UploadAssetRequestHandler
from morpheus.project.presentation.api.write.assets.UploadPreviewImageRequestHandler import UploadPreviewImageRequestHandler
from morpheus.project.types.Asset import AssetId
from morpheus.project.types.Project import ProjectId

router = APIRouter(prefix='/projects', tags=['Assets'], responses=FULL_READ_RESPONSES)


def _result(result):
    if not isinstance(result, tuple):
        return result

    if len(result) == 3:
        return result

    payload, status_code = result
    if status_code not in (200, 201, 204):
        raise HTTPException(status_code=status_code, detail=payload or 'Request failed')
    return payload


@router.get('/{project_id}/assets', operation_id='readAssets')
def read_assets(
    project_id: str,
    _: IdentityDependency,
    asset_type: Annotated[str | None, Query()] = None,
    file_name: Annotated[str | None, Query()] = None,
    description: Annotated[str | None, Query()] = None,
    page: Annotated[int | None, Query(ge=1)] = None,
    page_size: Annotated[int | None, Query(ge=1)] = None,
):
    return _result(ReadAssetListRequestHandler.handle(ProjectId.from_str(project_id), asset_type, file_name, description, page, page_size))


@router.get('/{project_id}/assets/{asset_id}', operation_id='readAsset')
def read_asset(project_id: str, asset_id: str, _: IdentityDependency):
    return _result(ReadAssetRequestHandler.handle(ProjectId.from_str(project_id), AssetId.from_str(asset_id)))


@router.get(
    '/{project_id}/assets/{asset_id}/file',
    operation_id='downloadAsset',
    responses={
        '200': {
            'content': {
                'image/tiff': {'schema': {'type': 'string', 'format': 'binary'}},
                'application/zip': {'schema': {'type': 'string', 'format': 'binary'}},
            }
        }
    },
)
def download_asset(project_id: str, asset_id: str, _: IdentityDependency):
    result = _result(DownloadAssetRequestHandler.handle(ProjectId.from_str(project_id), AssetId.from_str(asset_id)))
    path, media_type, file_name = result
    return FileResponse(path, media_type=media_type, filename=file_name)


@router.get('/{project_id}/assets/{asset_id}/data', operation_id='readAssetData')
def read_asset_data(
    project_id: str,
    asset_id: str,
    _: IdentityDependency,
    request: Request,
):
    band = request.query_params.get('band')
    return _result(ReadAssetDataRequestHandler.handle(ProjectId.from_str(project_id), AssetId.from_str(asset_id), int(band) if band is not None else None))


@router.get(
    '/{project_id}/preview_image',
    operation_id='readPreviewImage',
    responses={
        '200': {
            'content': {
                'image/jpeg': {'schema': {'type': 'string', 'format': 'binary'}},
                'image/png': {'schema': {'type': 'string', 'format': 'binary'}},
            }
        }
    },
)
def read_preview_image(project_id: str):
    result = ReadPreviewImageRequestHandler.handle(ProjectId.from_str(project_id))
    if isinstance(result, tuple) and len(result) == 3:
        path, media_type, file_name = result
        return FileResponse(path, media_type=media_type, filename=file_name)
    return _result(result)


@router.post('/{project_id}/assets', status_code=201, operation_id='uploadAsset', responses=UPLOAD_RESPONSES)
async def upload_asset(project_id: str, _: IdentityDependency, file: Annotated[UploadFile, File()], description: Annotated[str | None, Form()] = None):
    file_name, file_path = save_uploaded_file(file.filename, file.file)
    result = UploadAssetRequestHandler.handle(ProjectId.from_str(project_id), file_name, file_path, description)
    if isinstance(result, tuple) and len(result) == 2 and result[1] == 201:
        return JSONResponse(result[0], status_code=201, headers={'Location': result[0]['location']})
    return _result(result)


@router.put('/{project_id}/preview_image', status_code=204, operation_id='uploadPreviewImage', responses=UPLOAD_RESPONSES)
async def upload_preview_image(project_id: str, _: IdentityDependency, file: Annotated[UploadFile, File()]):
    file_name, file_path = save_uploaded_file(file.filename, file.file)
    return _result(UploadPreviewImageRequestHandler.handle(ProjectId.from_str(project_id), file_name, file_path))


@router.delete('/{project_id}/preview_image', status_code=204, operation_id='deletePreviewImage')
def delete_preview_image(project_id: str, _: IdentityDependency):
    return _result(DeletePreviewImageRequestHandler.handle(ProjectId.from_str(project_id)))
