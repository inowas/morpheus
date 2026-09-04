import dataclasses
from typing import Literal, TypedDict

from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.identity.Identity import GroupId, UserId
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ProjectPermissionEvents.PermissionEvents import ProjectGroupRoleUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Permissions import Role
from morpheus.project.types.Project import ProjectId


class UpdateProjectGroupRoleCommandPayload(TypedDict):
    project_id: str
    group_id: str
    role: Literal['owner', 'admin', 'editor', 'viewer'] | None


@dataclasses.dataclass(frozen=True)
class UpdateProjectGroupRoleCommand(ProjectCommandBase):
    group_id: GroupId
    role: Role | None

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateProjectGroupRoleCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            group_id=GroupId.from_str(payload['group_id']),
            role=Role.from_str(payload['role']) if payload['role'] else None,
        )


class UpdateProjectGroupRoleCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateProjectGroupRoleCommand):
        event = ProjectGroupRoleUpdatedEvent.from_payload(
            project_id=command.project_id,
            group_id=command.group_id,
            role=command.role,
            occurred_at=DateTime.now(),
        )
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(command.user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)
