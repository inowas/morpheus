import dataclasses
from typing import TypedDict

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelBoundaryEvents import ModelBoundariesRemovedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.boundaries.Boundary import BoundaryId


class RemoveModelBoundariesCommandPayload(TypedDict):
    project_id: str
    model_id: str
    boundary_ids: list[str]


@dataclasses.dataclass(frozen=True)
class RemoveModelBoundariesCommand(ProjectCommandBase):
    model_id: ModelId
    boundary_ids: list[BoundaryId]

    @classmethod
    def from_payload(cls, user_id: UserId, payload: RemoveModelBoundariesCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            boundary_ids=[BoundaryId.from_str(boundary_id) for boundary_id in payload['boundary_ids']]
        )


class RemoveModelBoundariesCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: RemoveModelBoundariesCommand):
        project_id = command.project_id
        user_id = command.user_id

        model_reader = ModelReader()
        latest_model = model_reader.get_latest_model(project_id=project_id)
        if latest_model.model_id != command.model_id:
            raise ValueError(f'Model {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        boundary_ids = [boundary_id for boundary_id in command.boundary_ids if latest_model.boundaries.has_boundary(boundary_id)]

        if len(boundary_ids) == 0:
            return None

        event = ModelBoundariesRemovedEvent.from_boundary_ids(
            project_id=project_id,
            model_id=command.model_id,
            boundary_ids=boundary_ids,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
