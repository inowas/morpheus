from fastapi import APIRouter, HTTPException

from morpheus.fastapi_auth import IdentityDependency
from morpheus.user.exceptions.InsufficientPermissionsException import InsufficientPermissionsException
from morpheus.user.exceptions.UnauthorizedException import UnauthorizedException
from morpheus.user.exceptions.UserNotFoundException import UserNotFoundException
from morpheus.user.presentation.api.read.GetCurrentUserRequestHandler import GetCurrentUserRequestHandler, GetCurrentUserResponse
from morpheus.user.presentation.api.read.GetGroupsRequestHandler import GetGroupsRequestHandler, GroupResponseItem
from morpheus.user.presentation.api.read.GetUsersRequestHandler import GetUsersRequestHandler, UserResponse, UserResponseItem

router = APIRouter(prefix='/users', tags=['Users'])


@router.get('', response_model=UserResponse, operation_id='read_users')
def read_users(_: IdentityDependency):
    try:
        return [UserResponseItem.model_validate(user) for user in GetUsersRequestHandler.handle()]
    except UnauthorizedException as exception:
        raise HTTPException(status_code=401, detail=str(exception)) from exception


@router.get('/me', response_model=GetCurrentUserResponse, operation_id='read_current_user')
def read_current_user(_: IdentityDependency):
    try:
        return GetCurrentUserRequestHandler.handle()
    except UnauthorizedException as exception:
        raise HTTPException(status_code=401, detail=str(exception)) from exception
    except UserNotFoundException as exception:
        raise HTTPException(status_code=404, detail=str(exception)) from exception


@router.get('/groups', response_model=list[GroupResponseItem], operation_id='read_groups')
def read_groups(_: IdentityDependency):
    try:
        return GetGroupsRequestHandler.handle()
    except UnauthorizedException as exception:
        raise HTTPException(status_code=401, detail=str(exception)) from exception
    except InsufficientPermissionsException as exception:
        raise HTTPException(status_code=403, detail=str(exception)) from exception
