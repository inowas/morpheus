import dataclasses
from typing import TypedDict

from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelObservationEvents import ModelObservationAddedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.geometry import Point
from morpheus.project.types.Model import ModelId
from morpheus.project.types.observations.HeadObservation import Head, HeadObservation, HeadObservationValue, ObservationId, ObservationName, ObservationTags
from morpheus.project.types.Project import ProjectId


class AddModelObservationCommandPayload(TypedDict):
    project_id: str
    model_id: str
    geometry: dict


@dataclasses.dataclass(frozen=True)
class AddModelObservationCommand(ProjectCommandBase):
    model_id: ModelId
    observation_id: ObservationId
    geometry: Point

    @classmethod
    def from_payload(cls, user_id: UserId, payload: AddModelObservationCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            observation_id=ObservationId.new(),
            geometry=Point.from_dict(payload['geometry']),
        )


class AddModelObservationCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: AddModelObservationCommand):
        project_id = command.project_id
        user_id = command.user_id

        model_reader = ModelReader()
        latest_model = model_reader.get_latest_model(project_id=project_id)

        if latest_model.model_id != command.model_id:
            raise ValueError(f'Model {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        observations = latest_model.observations
        observation_names = [observation.name for observation in observations if observation.name.to_str().startswith('hob-')]
        observation_names.sort(key=lambda name: int(name.to_str().split('-')[1]))
        last_observation_name = observation_names[-1] if observation_names else ObservationName.from_str('hob-1')
        last_observation_number = int(last_observation_name.to_str().split('-')[1])
        name = ObservationName.from_str(f'hob-{last_observation_number + 1}')

        current_grid = latest_model.spatial_discretization.grid
        top_layer_id = latest_model.layers[0].layer_id
        start_date_time = latest_model.time_discretization.start_date_time

        head_observation = HeadObservation.from_geometry(
            id=command.observation_id,
            name=name,
            tags=ObservationTags.empty(),
            geometry=command.geometry,
            grid=current_grid,
            affected_layers=[top_layer_id],
            data=[HeadObservationValue(date_time=start_date_time, head=Head.from_value(0.0))],
        )

        event = ModelObservationAddedEvent.from_observation(project_id=project_id, model_id=command.model_id, observation=head_observation, occurred_at=DateTime.now())

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
