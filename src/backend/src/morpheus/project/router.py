from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import JSONResponse, Response

from morpheus.common.types.HttpResponse import HttpResponse
from morpheus.common.types.ResourceCreated import ResourceCreated
from morpheus.fastapi_auth import IdentityDependency
from morpheus.fastapi_contract import AUTH_RESPONSES, FULL_READ_RESPONSES, NOT_FOUND_RESPONSES, PROJECT_LIST_RESPONSES
from morpheus.project.presentation.api.read.calculations.ReadCalculationProfilesRequestHandler import ReadCalculationProfilesRequestHandler
from morpheus.project.presentation.api.read.projects.ReadProjectEventLogRequestHandler import ReadProjectEventLogRequestHandler
from morpheus.project.presentation.api.read.projects.ReadProjectListRequestHandler import ProjectListResponse, ProjectSummaryResponse, ReadProjectListRequestHandler
from morpheus.project.presentation.api.read.projects.ReadProjectMetadataRequestHandler import ProjectMetadataResponse, ReadProjectMetadataRequestHandler
from morpheus.project.presentation.api.read.projects.ReadProjectPrivilegesRequestHandler import ReadProjectPrivilegesRequestHandler
from morpheus.project.presentation.api.read.projects.ReadProjectSelectedCalculationProfileRequestHandler import ReadProjectSelectedCalculationProfileRequestHandler
from morpheus.project.presentation.api.write.MessageBoxRequestHandler import MessageBoxRequest, MessageBoxRequestHandler
from morpheus.project.types.calculation.CalculationProfile import CalculationProfileId
from morpheus.project.types.Project import ProjectId

router = APIRouter(prefix='/projects', tags=['Projects'], responses=FULL_READ_RESPONSES)


@router.get('', response_model=ProjectListResponse, operation_id='readProjects', responses=PROJECT_LIST_RESPONSES)
def read_projects(
    _: IdentityDependency,
    search: Annotated[str | None, Query()] = None,
    public: Annotated[bool | None, Query()] = None,
    user_id: Annotated[str | None, Query()] = None,
    page: Annotated[int | None, Query()] = None,
    page_size: Annotated[int | None, Query()] = None,
):
    response, status_code = ReadProjectListRequestHandler.handle(search, public, user_id, page, page_size)
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=response or 'Unauthorized')
    return [ProjectSummaryResponse.model_validate(project) for project in response]


@router.get('/{project_id}/metadata', response_model=ProjectMetadataResponse, operation_id='readProjectMetadata')
def read_project_metadata(project_id: str, _: IdentityDependency):
    response, status_code = ReadProjectMetadataRequestHandler().handle(ProjectId.from_str(project_id))
    if status_code == 401:
        raise HTTPException(status_code=401, detail='Unauthorized')
    if status_code == 403:
        raise HTTPException(status_code=403, detail=response)
    if status_code == 404:
        raise HTTPException(status_code=404, detail=response)
    return ProjectMetadataResponse.model_validate(response)


@router.get('/{project_id}/privileges', response_model=list[str], operation_id='readProjectPrivileges')
def read_project_privileges(project_id: str, _: IdentityDependency):
    response, status_code = ReadProjectPrivilegesRequestHandler().handle(ProjectId.from_str(project_id))
    if status_code == 401:
        raise HTTPException(status_code=401, detail='Unauthorized')
    if status_code == 403:
        raise HTTPException(status_code=403, detail=response)
    if status_code == 404:
        raise HTTPException(status_code=404, detail=response)
    return response


@router.get('/{project_id}/event-log', operation_id='readProjectEventLog')
def read_project_event_log(project_id: str, _: IdentityDependency):
    response, status_code = ReadProjectEventLogRequestHandler.handle(ProjectId.from_str(project_id))
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=response or 'Request failed')
    return response


@router.get('/{project_id}/model/calculation-profile', operation_id='readModelCalculationProfile')
def read_model_calculation_profile(project_id: str, _: IdentityDependency):
    response, status_code = ReadProjectSelectedCalculationProfileRequestHandler().handle(ProjectId.from_str(project_id))
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=response or 'Request failed')
    return response


@router.get('/{project_id}/calculation-profiles', operation_id='readCalculationProfiles')
def read_calculation_profiles(project_id: str, _: IdentityDependency):
    response, status_code = ReadCalculationProfilesRequestHandler().handle(ProjectId.from_str(project_id))
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=response or 'Request failed')
    return response


@router.get('/{project_id}/calculation-profiles/selected', operation_id='readSelectedCalculationProfile')
def read_selected_calculation_profile(project_id: str, _: IdentityDependency):
    response, status_code = ReadProjectSelectedCalculationProfileRequestHandler().handle(ProjectId.from_str(project_id))
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=response or 'Request failed')
    return response


@router.get('/{project_id}/calculation-profiles/{calculation_profile_id}', operation_id='readCalculationProfile')
def read_calculation_profile(project_id: str, calculation_profile_id: str, _: IdentityDependency):
    response, status_code = ReadProjectSelectedCalculationProfileRequestHandler().handle(ProjectId.from_str(project_id), CalculationProfileId.from_str(calculation_profile_id))
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=response or 'Request failed')
    return response


@router.post(
    '/messagebox',
    status_code=status.HTTP_201_CREATED,
    operation_id='sendMessage',
    responses={
        401: AUTH_RESPONSES[401],
        403: AUTH_RESPONSES[403],
        404: NOT_FOUND_RESPONSES[404],
        500: FULL_READ_RESPONSES[500],
    },
)
def send_message(request: MessageBoxRequest, _: IdentityDependency):
    response = MessageBoxRequestHandler.handle(request)
    if isinstance(response, ResourceCreated):
        return Response(status_code=201, headers={'Location': response.location})
    if isinstance(response, HttpResponse):
        return JSONResponse(content=response.data, status_code=response.status_code, headers=response.headers)
    return response
