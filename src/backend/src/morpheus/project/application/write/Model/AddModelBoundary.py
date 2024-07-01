import dataclasses
from typing import TypedDict

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelBoundaryEvents import ModelBoundaryAddedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.boundaries.Boundary import BoundaryType, BoundaryName, BoundaryTags, IBoundaryTypeLiteral, BoundaryId
from morpheus.project.types.boundaries.BoundaryFactory import BoundaryFactory
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.geometry import GeometryFactory, Point, Polygon, LineString


class AddModelBoundaryCommandPayload(TypedDict):
    project_id: str
    model_id: str
    boundary_type: IBoundaryTypeLiteral
    boundary_geometry: dict


@dataclasses.dataclass(frozen=True)
class AddModelBoundaryCommand(ProjectCommandBase):
    model_id: ModelId
    boundary_id: BoundaryId
    type: BoundaryType
    name: BoundaryName
    tags: BoundaryTags
    geometry: Point | LineString | Polygon

    @classmethod
    def from_payload(cls, user_id: UserId, payload: AddModelBoundaryCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            boundary_id=BoundaryId.new(),
            type=BoundaryType.from_str(payload['boundary_type']),
            name=BoundaryName.from_str(f'New {payload["boundary_type"]} boundary'),
            tags=BoundaryTags.empty(),
            geometry=GeometryFactory.from_dict(payload['boundary_geometry']),
        )


class AddModelBoundaryCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: AddModelBoundaryCommand):
        project_id = command.project_id
        user_id = command.user_id

        model_reader = ModelReader()
        latest_model = model_reader.get_latest_model(project_id=project_id)

        if latest_model.model_id != command.model_id:
            raise ValueError(f'Model {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        current_grid = latest_model.spatial_discretization.grid
        top_layer_id = latest_model.layers[0].layer_id
        start_date_time = latest_model.time_discretization.start_date_time

        boundary = BoundaryFactory().create_with_default_data(
            boundary_id=command.boundary_id,
            boundary_type=command.type,
            geometry=command.geometry,
            affected_cells=ActiveCells.from_geometry(geometry=command.geometry, grid=current_grid),
            affected_layers=[top_layer_id],
            start_date_time=start_date_time,
        )

        if boundary is None:
            return

        event = ModelBoundaryAddedEvent.from_boundary(
            project_id=project_id,
            model_id=command.model_id,
            boundary=boundary,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
