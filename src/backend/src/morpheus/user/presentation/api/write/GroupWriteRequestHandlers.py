from flask import Request
from morpheus.authentication.outgoing import get_identity
from morpheus.common.types.Exceptions import NotFoundException
from morpheus.common.types.identity.Identity import Identity
from morpheus.user.application.write.AddMemberToGroup import AddMembersToGroupCommand, AddMembersToGroupCommandHandler
from morpheus.user.application.write.CreateGroup import CreateGroupCommand, CreateGroupCommandHandler
from morpheus.user.types.Group import GroupId, GroupName
from morpheus.user.types.User import UserId


class CreateGroupRequestHandler:
    @staticmethod
    def handle(request: Request):
        identity = Identity.try_from_dict(get_identity())
        if identity is None:
            return '', 401

        if not identity.is_admin:
            return '', 403

        command = CreateGroupCommand(
            group_id=GroupId.new(),
            name=GroupName.from_str(request.json.get('name')),
            creator_id=identity.user_id
        )
        CreateGroupCommandHandler.handle(command)
        return '', 204

class AddMembersToGroupRequestHandler:
    @staticmethod
    def handle(group_id: GroupId, request: Request):
        identity = Identity.try_from_dict(get_identity())
        if identity is None:
            return '', 401

        if not identity.is_admin:
            return '', 403

        member_list_from_request = request.json
        if not isinstance(member_list_from_request, list):
            return 'Request body must be an array', 400

        try:
            command = AddMembersToGroupCommand(
                group_id=group_id,
                members=set([UserId.from_str(member) for member in member_list_from_request]),
                creator_id=identity.user_id
            )
            AddMembersToGroupCommandHandler.handle(command)
            return '', 204
        except NotFoundException:
            return '', 404
