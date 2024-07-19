import dataclasses
from typing import TypedDict, Literal

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelObservationEvents import ModelObservationUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.geometry import Point
from morpheus.project.types.layers import LayerId
from morpheus.project.types.observations.HeadObservation import ObservationId, ObservationType, ObservationName, ObservationTags, HeadObservationValue


class HeadObservationDict(TypedDict):
    id: str
    type: str
    name: str
    tags: list[str]
    geometry: dict
    affected_cells: list[dict]
    affected_layers: list[str]
    data: list[dict]
    enabled: bool


class UpdateModelObservationCommandPayload(TypedDict):
    project_id: str
    model_id: str
    observation_id: str
    type: Literal['head']
    name: str
    tags: list[str]
    geometry: dict
    affected_cells: dict
    affected_layers: list[str]
    data: list[dict]
    enabled: bool


@dataclasses.dataclass(frozen=True)
class UpdateModelObservationCommand(ProjectCommandBase):
    model_id: ModelId
    observation_id: ObservationId
    type: ObservationType
    name: ObservationName
    tags: ObservationTags
    geometry: Point
    affected_cells: ActiveCells
    affected_layers: list[LayerId]
    data: list[HeadObservationValue]
    enabled: bool

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelObservationCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            observation_id=ObservationId.from_str(payload['observation_id']),
            type=ObservationType.from_str(payload['type']),
            name=ObservationName.from_str(payload['name']),
            tags=ObservationTags.from_list(payload['tags']),
            geometry=Point.from_dict(payload['geometry']),
            affected_cells=ActiveCells.from_dict(payload['affected_cells']),
            affected_layers=[LayerId.from_str(layer_id) for layer_id in payload['affected_layers']],
            data=[HeadObservationValue.from_dict(value) for value in payload['data']],
            enabled=payload['enabled']
        )


class UpdateModelObservationCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelObservationCommand):
        project_id = command.project_id
        user_id = command.user_id

        model_reader = ModelReader()
        latest_model = model_reader.get_latest_model(project_id=project_id)

        if latest_model.model_id != command.model_id:
            raise ValueError(f'Model {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        event = ModelObservationUpdatedEvent.from_observation(
            project_id=project_id,
            model_id=command.model_id,
            observation_id=command.observation_id,
            type=command.type,
            name=command.name,
            tags=command.tags,
            geometry=command.geometry,
            affected_cells=command.affected_cells,
            affected_layers=command.affected_layers,
            data=command.data,
            enabled=command.enabled,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
