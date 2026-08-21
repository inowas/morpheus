from fastapi import APIRouter, HTTPException

from morpheus.fastapi_auth import IdentityDependency
from morpheus.project.presentation.api.read.projects.ReadProjectListRequestHandler import ProjectListResponse, ProjectSummaryResponse, ReadProjectListRequestHandler
from morpheus.project.presentation.api.read.projects.ReadProjectMetadataRequestHandler import ProjectMetadataResponse, ReadProjectMetadataRequestHandler
from morpheus.project.presentation.api.read.projects.ReadProjectPrivilegesRequestHandler import ReadProjectPrivilegesRequestHandler
from morpheus.project.types.Project import ProjectId

router = APIRouter(prefix='/projects', tags=['Projects'])


@router.get('', response_model=ProjectListResponse, operation_id='read_projects')
def read_projects(_: IdentityDependency):
    response, status_code = ReadProjectListRequestHandler.handle()
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=response or 'Unauthorized')
    return [ProjectSummaryResponse.model_validate(project) for project in response]


@router.get('/{project_id}/metadata', response_model=ProjectMetadataResponse, operation_id='read_project_metadata')
def read_project_metadata(project_id: str, _: IdentityDependency):
    response, status_code = ReadProjectMetadataRequestHandler().handle(ProjectId.from_str(project_id))
    if status_code == 401:
        raise HTTPException(status_code=401, detail='Unauthorized')
    if status_code == 403:
        raise HTTPException(status_code=403, detail=response)
    if status_code == 404:
        raise HTTPException(status_code=404, detail=response)
    return ProjectMetadataResponse.model_validate(response)


@router.get('/{project_id}/privileges', response_model=list[str], operation_id='read_project_privileges')
def read_project_privileges(project_id: str, _: IdentityDependency):
    response, status_code = ReadProjectPrivilegesRequestHandler().handle(ProjectId.from_str(project_id))
    if status_code == 401:
        raise HTTPException(status_code=401, detail='Unauthorized')
    if status_code == 403:
        raise HTTPException(status_code=403, detail=response)
    if status_code == 404:
        raise HTTPException(status_code=404, detail=response)
    return response
