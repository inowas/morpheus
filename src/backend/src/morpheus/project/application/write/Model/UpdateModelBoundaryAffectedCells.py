import dataclasses
from typing import TypedDict

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelBoundaryEvents import ModelBoundaryAffectedCellsUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.boundaries.Boundary import BoundaryId
from morpheus.project.types.discretization.spatial import ActiveCells


class UpdateModelBoundaryAffectedCellsCommandPayload(TypedDict):
    project_id: str
    model_id: str
    boundary_id: str
    affected_cells: dict


@dataclasses.dataclass(frozen=True)
class UpdateModelBoundaryAffectedCellsCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    boundary_id: BoundaryId
    affected_cells: ActiveCells

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelBoundaryAffectedCellsCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            boundary_id=BoundaryId.from_str(payload['boundary_id']),
            affected_cells=ActiveCells.from_dict(payload['affected_cells']),
        )


class UpdateModelBoundaryAffectedCellsCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelBoundaryAffectedCellsCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the affected cells of {project_id.to_str()}')

        model = ModelReader().get_latest_model(project_id=project_id)
        if model.model_id != command.model_id:
            raise ValueError(f'Model {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        if not model.boundaries.has_boundary(boundary_id=command.boundary_id):
            raise ValueError(f'Boundary {command.boundary_id.to_str()} does not exist in model {command.model_id.to_str()}')

        event = ModelBoundaryAffectedCellsUpdatedEvent.from_props(
            project_id=project_id,
            model_id=command.model_id,
            boundary_id=command.boundary_id,
            affected_cells=command.affected_cells,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
