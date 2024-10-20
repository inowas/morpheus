import dataclasses
from typing import TypedDict, Literal

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ProjectPermissionEvents.PermissionEvents import VisibilityUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Permissions import Visibility
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId


class UpdateProjectVisibilityCommandPayload(TypedDict):
    project_id: str
    visibility: Literal['public', 'private']


@dataclasses.dataclass(frozen=True)
class UpdateProjectVisibilityCommand(ProjectCommandBase):
    visibility: Visibility

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateProjectVisibilityCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            visibility=Visibility.from_str(payload['visibility']),
        )


class UpdateProjectVisibilityCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateProjectVisibilityCommand):
        project_id = command.project_id
        user_id = command.user_id

        event = VisibilityUpdatedEvent.from_visibility(project_id=project_id, visibility=command.visibility, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)
