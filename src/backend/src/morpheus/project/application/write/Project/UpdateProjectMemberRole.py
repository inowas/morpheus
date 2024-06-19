import dataclasses
from typing import TypedDict, Literal

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ProjectPermissionEvents.PermissionEvents import MemberRoleUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Permissions import Role
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId


class UpdateProjectMemberRoleCommandPayload(TypedDict):
    project_id: str
    member_id: str
    new_role: Literal['owner', 'admin', 'editor', 'viewer']


@dataclasses.dataclass(frozen=True)
class UpdateProjectMemberRoleCommand(CommandBase):
    project_id: ProjectId
    member_id: UserId
    new_role: Role

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateProjectMemberRoleCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            member_id=UserId.from_str(payload['member_id']),
            new_role=Role.from_str(payload['new_role']),
        )


class UpdateProjectMemberRoleCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateProjectMemberRoleCommand):
        project_id = command.project_id
        member_id = command.member_id
        new_role = command.new_role
        user_id = command.user_id

        permissions = PermissionsReader().get_permissions(project_id=project_id)
        if not permissions.members.member_can_edit_members_and_permissions(user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update a member of the project {project_id.to_str()}')

        if not permissions.members.has_member(member_id):
            return

        event = MemberRoleUpdatedEvent.from_user_id_and_role(project_id=project_id, user_id=member_id, new_role=new_role, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)
