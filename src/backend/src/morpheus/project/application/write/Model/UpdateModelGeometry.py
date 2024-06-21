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
from morpheus.project.domain.events.ModelEvents.ModelDiscretizationEvents import ModelGridRecalculatedEvent, ModelGeometryUpdatedEvent, ModelAffectedCellsRecalculatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.geometry import Polygon


class UpdateModelGeometryCommandPayload(TypedDict):
    project_id: str
    geometry: dict


@dataclasses.dataclass(frozen=True)
class UpdateModelGeometryCommand(CommandBase):
    project_id: ProjectId
    geometry: Polygon

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelGeometryCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            geometry=Polygon.from_dict(payload['geometry']),
        )


class UpdateModelGeometryCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelGeometryCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the geometry of {project_id.to_str()}')

        model_reader = ModelReader()
        model = model_reader.get_latest_model(project_id=project_id)

        new_geometry = command.geometry
        new_grid = model.spatial_discretization.grid.with_updated_geometry(new_geometry)
        new_affected_cells = ActiveCells.from_polygon(polygon=command.geometry, grid=new_grid)

        event = ModelGridRecalculatedEvent.from_grid(project_id=project_id, grid=new_grid, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = ModelGeometryUpdatedEvent.from_geometry(project_id=project_id, polygon=new_geometry, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = ModelAffectedCellsRecalculatedEvent.from_affected_cells(project_id=project_id, affected_cells=new_affected_cells, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
