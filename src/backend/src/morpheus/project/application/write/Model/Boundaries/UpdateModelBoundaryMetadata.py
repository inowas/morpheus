import dataclasses
from typing import TypedDict, Optional

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelBoundaryEvents import ModelBoundaryMetadataUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.boundaries.Boundary import BoundaryId, BoundaryName, BoundaryTags


class UpdateModelBoundaryMetadataCommandPayload(TypedDict):
    project_id: str
    model_id: str
    boundary_id: str
    boundary_name: Optional[str]
    boundary_tags: Optional[list[str]]


@dataclasses.dataclass(frozen=True)
class UpdateModelBoundaryMetadataCommand(ProjectCommandBase):
    model_id: ModelId
    boundary_id: BoundaryId
    boundary_name: Optional[BoundaryName]
    boundary_tags: Optional[BoundaryTags]

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelBoundaryMetadataCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            boundary_id=BoundaryId.from_str(payload['boundary_id']),
            boundary_name=BoundaryName.from_str(payload['boundary_name']) if 'boundary_name' in payload and payload['boundary_name'] else None,
            boundary_tags=BoundaryTags.from_list(payload['boundary_tags']) if 'boundary_tags' in payload and isinstance(payload['boundary_tags'], list) else None
        )


class UpdateModelBoundaryMetadataCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelBoundaryMetadataCommand):
        project_id = command.project_id
        user_id = command.user_id

        model = ModelReader().get_latest_model(project_id=project_id)
        if model.model_id != command.model_id:
            raise ValueError(f'Model {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        if not model.boundaries.has_boundary(boundary_id=command.boundary_id):
            raise ValueError(
                f'Boundary {command.boundary_id.to_str()} does not exist in model {command.model_id.to_str()}')

        event = ModelBoundaryMetadataUpdatedEvent.from_props(
            project_id=project_id,
            model_id=command.model_id,
            boundary_id=command.boundary_id,
            name=command.boundary_name,
            tags=command.boundary_tags,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
