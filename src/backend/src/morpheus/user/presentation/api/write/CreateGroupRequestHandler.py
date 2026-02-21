from morpheus.authentication.outgoing import get_identity
from morpheus.common.api.Pydantic import BaseModel, Field
from morpheus.common.types.identity.Identity import GroupId, Identity
from morpheus.user.application.write.CreateGroup import CreateGroupCommand, CreateGroupCommandHandler
from morpheus.user.types.Group import GroupName


class CreateGroupRequest(BaseModel):
    name: str = Field(examples=['Group Name'])


class CreateGroupRequestHandler:
    @staticmethod
    def handle(request: CreateGroupRequest):
        identity = Identity.try_from_dict(get_identity())
        if identity is None:
            return '', 401

        if not identity.is_admin:
            return '', 403

        command = CreateGroupCommand(
            group_id=GroupId.new(),
            name=GroupName.from_str(request.name),
            creator_id=identity.user_id,
        )
        CreateGroupCommandHandler.handle(command)
        return '', 204
