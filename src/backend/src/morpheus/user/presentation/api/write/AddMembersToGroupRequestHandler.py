from pydantic import BaseModel, Field

from morpheus.authentication.outgoing import get_identity
from morpheus.common.types.identity.Identity import GroupId, Identity, UserId
from morpheus.user.application.write.AddMemberToGroup import AddMembersToGroupCommand, AddMembersToGroupCommandHandler
from morpheus.user.exceptions.InsufficientPermissionsException import InsufficientPermissionsException
from morpheus.user.exceptions.UnauthorizedException import UnauthorizedException


class AddMembersToGroupRequest(BaseModel):
    member_ids: list[str] = Field(examples=[['user_id_1', 'user_id_2']])


class AddMembersToGroupRequestHandler:
    @staticmethod
    def handle(group_id: GroupId, request: AddMembersToGroupRequest):
        identity = Identity.try_from_dict(get_identity())
        if identity is None:
            raise UnauthorizedException()

        if not identity.is_admin:
            raise InsufficientPermissionsException()

        command = AddMembersToGroupCommand(
            group_id=group_id,
            members=set([UserId.from_str(member_id) for member_id in request.member_ids]),
            creator_id=identity.user_id,
        )
        AddMembersToGroupCommandHandler.handle(command)
