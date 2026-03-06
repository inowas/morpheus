from flask import Blueprint, request
from flask_cors import CORS, cross_origin

from morpheus.common.presentation.api.middleware.schema_validation import validate_request
from morpheus.common.types.identity.Identity import GroupId
from morpheus.user.exceptions.GroupNotFoundException import GroupNotFoundException
from morpheus.user.exceptions.InsufficientPermissionsException import InsufficientPermissionsException
from morpheus.user.exceptions.UnauthorizedException import UnauthorizedException
from morpheus.user.exceptions.UserNotFoundException import UserNotFoundException
from morpheus.user.incoming import authenticate
from morpheus.user.presentation.api.read.GetCurrentUserRequestHandler import GetCurrentUserRequestHandler
from morpheus.user.presentation.api.read.GetGroupsRequestHandler import GetGroupsRequestHandler
from morpheus.user.presentation.api.read.GetUsersRequestHandler import GetUsersRequestHandler
from morpheus.user.presentation.api.write.AddMembersToGroupRequestHandler import AddMembersToGroupRequest, AddMembersToGroupRequestHandler
from morpheus.user.presentation.api.write.CreateGroupRequestHandler import CreateGroupRequest, CreateGroupRequestHandler


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)

    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    @authenticate()
    def read_user_list():
        try:
            return GetUsersRequestHandler().handle()
        except UnauthorizedException as e:
            return {'error': str(e)}, 401
        except Exception:
            return {'error': 'An unexpected error occurred'}, 500

    @blueprint.route('/me', methods=['GET'])
    @cross_origin()
    @authenticate()
    def read_authenticated_user():
        try:
            return GetCurrentUserRequestHandler().handle()
        except UnauthorizedException as e:
            return {'error': str(e)}, 401
        except UserNotFoundException as e:
            return {'error': str(e)}, 404
        except Exception:
            return {'error': 'An unexpected error occurred'}, 500

    @blueprint.route('/groups', methods=['GET'])
    @cross_origin()
    @authenticate()
    def read_group_list():
        try:
            return GetGroupsRequestHandler().handle()
        except UnauthorizedException as e:
            return {'error': str(e)}, 401
        except InsufficientPermissionsException as e:
            return {'error': str(e)}, 403
        except Exception:
            return {'error': 'An unexpected error occurred'}, 500

    @blueprint.route('/groups', methods=['POST'])
    @cross_origin()
    @authenticate()
    @validate_request
    def create_group():
        try:
            CreateGroupRequestHandler().handle(request=CreateGroupRequest(**request.get_json()))
            return None, 204
        except UnauthorizedException as e:
            return {'error': str(e)}, 401
        except InsufficientPermissionsException as e:
            return {'error': str(e)}, 403
        except Exception:
            return {'error': 'An unexpected error occurred'}, 500

    @blueprint.route('/groups/<group_id>/members', methods=['POST'])
    @cross_origin()
    @authenticate()
    @validate_request
    def add_members_to_group(group_id: str):
        try:
            return AddMembersToGroupRequestHandler().handle(group_id=GroupId.from_str(group_id), request=AddMembersToGroupRequest(**request.get_json()))
        except UnauthorizedException as e:
            return {'error': str(e)}, 401
        except InsufficientPermissionsException as e:
            return {'error': str(e)}, 403
        except GroupNotFoundException as e:
            return {'error': str(e)}, 404
        except Exception:
            return {'error': 'An unexpected error occurred'}, 500
