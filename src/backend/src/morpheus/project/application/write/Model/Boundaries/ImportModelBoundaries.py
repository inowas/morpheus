import dataclasses
from typing import TypedDict, Optional

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
from morpheus.project.types.boundaries.Boundary import BoundaryId, BoundaryName, BoundaryTags
from morpheus.project.types.boundaries.BoundaryInterpolationType import InterpolationType
from morpheus.project.types.boundaries.BoundaryType import BoundaryTypeLiteral, BoundaryType
from morpheus.project.types.boundaries.BoundaryFactory import BoundaryFactory
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.geometry import GeometryFactory


class ImportBoundaryDict(TypedDict):
    id: Optional[str]
    type: BoundaryTypeLiteral
    name: str
    interpolation: Optional[str]
    tags: Optional[list[str]]
    geometry: dict
    affected_cells: Optional[dict]
    affected_layers: list[int]
    data: list[dict]


class ImportModelBoundaryCommandPayload(TypedDict):
    project_id: str
    model_id: str
    boundaries: list[dict]


@dataclasses.dataclass(frozen=True)
class ImportModelBoundariesCommand(ProjectCommandBase):
    model_id: ModelId
    boundaries: list[dict]

    @classmethod
    def from_payload(cls, user_id: UserId, payload: ImportModelBoundaryCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            boundaries=payload['boundaries']
        )


class ImportModelBoundariesCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: ImportModelBoundariesCommand):
        project_id = command.project_id
        user_id = command.user_id

        model_reader = ModelReader()
        latest_model = model_reader.get_latest_model(project_id=project_id)

        if latest_model.model_id != command.model_id:
            raise ValueError(f'Model {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        grid = latest_model.spatial_discretization.grid
        layer_ids = [layer.layer_id for layer in latest_model.layers]
        start_date_time = latest_model.time_discretization.start_date_time

        boundaries = []
        for boundary_dict in command.boundaries:
            boundary_id = BoundaryId.from_str(boundary_dict['id']) if boundary_dict['id'] else BoundaryId.new()
            boundary_type = BoundaryType.from_str(boundary_dict['type'])
            name = BoundaryName.from_str(boundary_dict['name'])
            tags = BoundaryTags.from_list(boundary_dict['tags']) if boundary_dict['tags'] else BoundaryTags.empty()
            interpolation = InterpolationType(boundary_dict['interpolation']) if boundary_dict['interpolation'] else InterpolationType.default
            geometry = GeometryFactory.from_dict(boundary_dict['geometry'])
            affected_cells = ActiveCells.from_dict(boundary_dict['affected_cells']) if boundary_dict['affected_cells'] else ActiveCells.from_geometry(geometry=geometry, grid=grid)
            affected_layers = [layer_ids[layer_id] for layer_id in boundary_dict['affected_layers']]
            data = boundary_dict['data']

            boundary = BoundaryFactory().create_from_single_observation_import(
                boundary_id=boundary_id,
                boundary_type=boundary_type,
                name=name,
                tags=tags,
                interpolation=interpolation,
                geometry=geometry,
                affected_cells=affected_cells,
                affected_layers=affected_layers,
                data=data,
                start_date_time=start_date_time,
            )

            if boundary is not None:
                boundaries.append(boundary)

        for boundary in boundaries:
            event = ModelBoundaryAddedEvent.from_boundary(
                project_id=project_id,
                model_id=command.model_id,
                boundary=boundary,
                occurred_at=DateTime.now()
            )

            event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
            event_envelope = EventEnvelope(event=event, metadata=event_metadata)
            project_event_bus.record(event_envelope=event_envelope)
