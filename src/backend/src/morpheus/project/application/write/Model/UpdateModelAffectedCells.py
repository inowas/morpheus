import dataclasses
from typing import TypedDict

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents import ModelAffectedCellsUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.discretization.spatial import ActiveCells


class UpdateModelAffectedCellsCommandPayload(TypedDict):
    affected_cells: dict


@dataclasses.dataclass(frozen=True)
class UpdateModelAffectedCellsCommand(CommandBase):
    project_id: ProjectId
    affected_cells: ActiveCells

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            affected_cells=ActiveCells.from_dict(payload['affected_cells']),
        )


class UpdateModelAffectedCellsCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelAffectedCellsCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the affected cells of {project_id.to_str()}')

        event = ModelAffectedCellsUpdatedEvent.from_affected_cells(project_id=project_id, affected_cells=command.affected_cells, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)