from fastapi import APIRouter, HTTPException, status
from fastapi.responses import Response

from morpheus.common.types.identity.Identity import GroupId
from morpheus.fastapi_auth import IdentityDependency
from morpheus.fastapi_contract import NOT_FOUND_RESPONSES
from morpheus.user.exceptions.InsufficientPermissionsException import InsufficientPermissionsException
from morpheus.user.exceptions.UnauthorizedException import UnauthorizedException
from morpheus.user.exceptions.UserNotFoundException import UserNotFoundException
from morpheus.user.presentation.api.read.GetCurrentUserRequestHandler import GetCurrentUserRequestHandler, GetCurrentUserResponse
from morpheus.user.presentation.api.read.GetGroupsRequestHandler import GetGroupsRequestHandler, GroupResponseItem
from morpheus.user.presentation.api.read.GetUsersRequestHandler import GetUsersRequestHandler, UserResponse, UserResponseItem
from morpheus.user.presentation.api.write.AddMembersToGroupRequestHandler import AddMembersToGroupRequest, AddMembersToGroupRequestHandler
from morpheus.user.presentation.api.write.CreateGroupRequestHandler import CreateGroupRequest, CreateGroupRequestHandler

router = APIRouter(prefix='/users', tags=['Users'], responses=NOT_FOUND_RESPONSES)


@router.get('', response_model=UserResponse, operation_id='readUsers')
def read_users(_: IdentityDependency):
    try:
        return [UserResponseItem.model_validate(user) for user in GetUsersRequestHandler.handle()]
    except UnauthorizedException as exception:
        raise HTTPException(status_code=401, detail=str(exception)) from exception


@router.get('/me', response_model=GetCurrentUserResponse, operation_id='readMe')
def read_current_user(_: IdentityDependency):
    try:
        return GetCurrentUserRequestHandler.handle()
    except UnauthorizedException as exception:
        raise HTTPException(status_code=401, detail=str(exception)) from exception
    except UserNotFoundException as exception:
        raise HTTPException(status_code=404, detail=str(exception)) from exception


@router.get('/groups', response_model=list[GroupResponseItem], operation_id='readGroups')
def read_groups(_: IdentityDependency):
    try:
        return GetGroupsRequestHandler.handle()
    except UnauthorizedException as exception:
        raise HTTPException(status_code=401, detail=str(exception)) from exception
    except InsufficientPermissionsException as exception:
        raise HTTPException(status_code=403, detail=str(exception)) from exception


@router.post('/groups', status_code=status.HTTP_201_CREATED, operation_id='createGroup')
def create_group(request: CreateGroupRequest, _: IdentityDependency):
    try:
        CreateGroupRequestHandler.handle(request)
    except UnauthorizedException as exception:
        raise HTTPException(status_code=401, detail=str(exception)) from exception
    except InsufficientPermissionsException as exception:
        raise HTTPException(status_code=403, detail=str(exception)) from exception
    return Response(status_code=201)


@router.post('/groups/{group_id}/members', status_code=status.HTTP_201_CREATED, operation_id='addGroupMembers')
def add_group_members(group_id: str, member_ids: list[str], _: IdentityDependency):
    try:
        AddMembersToGroupRequestHandler.handle(GroupId.from_str(group_id), AddMembersToGroupRequest(member_ids=member_ids))
    except UnauthorizedException as exception:
        raise HTTPException(status_code=401, detail=str(exception)) from exception
    except InsufficientPermissionsException as exception:
        raise HTTPException(status_code=403, detail=str(exception)) from exception
    return Response(status_code=201)
