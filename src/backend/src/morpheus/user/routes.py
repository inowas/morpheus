from flask import Blueprint, request
from flask_cors import CORS, cross_origin

from morpheus.common.presentation.api.middleware.schema_validation import validate_request
from morpheus.common.types.identity.Identity import GroupId
from morpheus.user.incoming import authenticate
from morpheus.user.presentation.api.read.GroupReadRequestHandlers import ReadGroupListRequestHandler
from morpheus.user.presentation.api.read.UserReadRequestHandlers import ReadAuthenticatedUserRequestHandler, ReadUserListRequestHandler
from morpheus.user.presentation.api.write.GroupWriteRequestHandlers import AddMembersToGroupRequestHandler, CreateGroupRequestHandler


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)

    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    @authenticate()
    def read_user_list():
        return ReadUserListRequestHandler().handle()

    @blueprint.route('/me', methods=['GET'])
    @cross_origin()
    @authenticate()
    def read_authenticated_user():
        return ReadAuthenticatedUserRequestHandler().handle()

    @blueprint.route('/groups', methods=['GET'])
    @cross_origin()
    @authenticate()
    def read_group_list():
        return ReadGroupListRequestHandler().handle()

    @blueprint.route('/groups', methods=['POST'])
    @cross_origin()
    @authenticate()
    @validate_request
    def create_group():
        return CreateGroupRequestHandler().handle(request)

    @blueprint.route('/groups/<group_id>/members', methods=['POST'])
    @cross_origin()
    @authenticate()
    @validate_request
    def add_members_to_group(group_id: str):
        return AddMembersToGroupRequestHandler().handle(GroupId.from_str(group_id), request)
