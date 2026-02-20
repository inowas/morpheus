import dataclasses
from typing import Literal, TypedDict

from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ProjectPermissionEvents.PermissionEvents import MemberAddedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Permissions import Role
from morpheus.project.types.Project import ProjectId


class AddProjectMemberCommandPayload(TypedDict):
    project_id: str
    new_member_id: str
    new_member_role: Literal['owner', 'admin', 'editor', 'viewer']


@dataclasses.dataclass(frozen=True)
class AddProjectMemberCommand(ProjectCommandBase):
    new_member_id: UserId
    new_member_role: Role

    @classmethod
    def from_payload(cls, user_id: UserId, payload: AddProjectMemberCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            new_member_id=UserId.from_str(payload['new_member_id']),
            new_member_role=Role.from_str(payload['new_member_role']),
        )


class AddProjectMemberCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: AddProjectMemberCommand):
        project_id = command.project_id
        new_member_id = command.new_member_id
        new_member_role = command.new_member_role
        user_id = command.user_id

        permissions = PermissionsReader().get_permissions(project_id=project_id)
        if permissions.members.has_member(new_member_id):
            return

        event = MemberAddedEvent.from_user_id_and_role(project_id=project_id, user_id=new_member_id, role=new_member_role, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)
