import dataclasses
from typing import TypedDict

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
from morpheus.project.types.observations.HeadObservation import ObservationId, HeadObservation


class HeadObservationDict(TypedDict):
    id: str
    name: str
    tags: list[str]
    geometry: dict
    affected_layers: list[str]
    data: list[dict]


class UpdateModelObservationCommandPayload(TypedDict):
    project_id: str
    model_id: str
    observation_id: str
    observation: HeadObservationDict


@dataclasses.dataclass(frozen=True)
class UpdateModelObservationCommand(ProjectCommandBase):
    model_id: ModelId
    observation_id: ObservationId
    observation: HeadObservation

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelObservationCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            observation_id=ObservationId.from_str(payload['observation_id']),
            observation=HeadObservation.from_dict(payload['observation'])
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
            observation=command.observation,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
