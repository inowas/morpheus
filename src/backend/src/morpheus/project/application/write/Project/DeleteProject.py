import dataclasses

from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.Exceptions import NotFoundException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.ProjectReader import project_reader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.infrastructure.assets.AssetHandlingService import asset_handling_service
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.domain.events.ProjectEvents.ProjectEvents import ProjectDeletedEvent
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId


@dataclasses.dataclass(frozen=True)
class DeleteProjectCommand(ProjectCommandBase):

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
        )


class DeleteProjectCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: DeleteProjectCommand):
        if not project_reader.project_exists(command.project_id):
            raise NotFoundException(f'Project with id {command.project_id.to_str()} does not exist')

        # delete project from filesystem
        # delete project from mongo db
        # delete all assets for project
        asset_handling_service.delete_all_assets_for_project(command.project_id)

        event = ProjectDeletedEvent.from_project_id(project_id=command.project_id, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(command.user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)
