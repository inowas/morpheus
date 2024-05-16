import dataclasses
from typing import TypedDict, Literal

from morpheus.common.types import Uuid
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ProjectPermissionEvents.PermissionEvents import VisibilityUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Permissions import Visibility
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId


class UpdateProjectVisibilityCommandPayload(TypedDict):
    project_id: str
    visibility: Literal['public', 'private']


@dataclasses.dataclass(frozen=True)
class UpdateProjectVisibilityCommand(CommandBase):
    project_id: ProjectId
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

        permissions = PermissionsReader().get_permissions(project_id=project_id)
        if not permissions.members.member_can_edit_members_and_permissions(user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to remove a member from the project {project_id.to_str()}')

        event = VisibilityUpdatedEvent.from_visibility(project_id=project_id, visibility=command.visibility)
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)
