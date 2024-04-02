from morpheus.common.infrastructure.files.FileService import FileService
from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import NotFoundException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from .ProjectCommands import CreateProjectCommand, DeleteProjectCommand, UpdateProjectMetadataCommand, UpdateProjectPreviewImageCommand
from ..read.ProjectsReader import projects_reader
from ...domain.AssetService import AssetService

from ...domain.events.ProjectEvents import ProjectCreatedEvent, ProjectMetadataUpdatedEvent, ProjectDeletedEvent
from ...infrastructure.assets.AssetFileStorage import asset_file_storage
from ...infrastructure.assets.PreviewImageService import preview_image_service
from ...infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from ...types.Asset import Asset, AssetType
from ...types.Project import Project


class CreateProjectCommandHandler:

    @staticmethod
    def handle(command: CreateProjectCommand):
        project = Project.new(user_id=command.user_id, project_id=command.project_id)
        metadata = project.metadata.with_updated_name(command.name).with_updated_description(command.description).with_updated_tags(command.tags)
        project = project.with_updated_metadata(metadata)

        event = ProjectCreatedEvent.from_project(project=project, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(command.user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)


class DeleteProjectCommandHandler:
    @staticmethod
    def handle(command: DeleteProjectCommand):
        if not projects_reader.project_exists(command.project_id):
            raise NotFoundException(f'Project with id {command.project_id.to_str()} does not exist')

        # todo assert user has access to project
        # permissions = permissions_reader.get_permissions(command.project_id)
        # read user with groups (from user module)
        # pass permissions and user with groups to domain service that checks permission

        # delete project from filesystem
        # delete project from mongo db

        event = ProjectDeletedEvent.from_project_id(project_id=command.project_id, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(command.user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)


class UpdateProjectMetadataCommandHandler:
    @staticmethod
    def handle(command: UpdateProjectMetadataCommand) -> None:
        project_id = command.project_id
        if not projects_reader.project_exists(project_id):
            raise NotFoundException(f'Project with id {project_id.to_str()} does not exist')

        # todo assert user has access to project

        event = ProjectMetadataUpdatedEvent.from_props(project_id=project_id, name=command.name, description=command.description, tags=command.tags, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(command.user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)


class UpdatePreviewImageCommandHandler:
    @staticmethod
    def handle(command: UpdateProjectPreviewImageCommand) -> None:
        if not projects_reader.project_exists(command.project_id):
            raise NotFoundException(f'Project with id {command.project_id.to_str()} does not exist')

        # todo assert user has access to project
        # permissions = permissions_reader.get_permissions(command.project_id)
        # read user with groups (from user module)
        # pass permissions and user with groups to domain service that checks permission

        file = FileService.build_file_info(command.file_path, command.file_name)
        AssetService.assert_file_can_be_used_as_preview_image(file)

        # resize image to preview image size
        preview_image_service.resize_as_preview_image(command.file_path)
        asset = Asset(id=command.asset_id, project_id=command.project_id, type=AssetType.IMAGE, file=file)

        # check if old preview image exists, if so delete it

        # save asset to filesystem
        asset_file_storage.save_asset(asset, command.file_path)
        # persist asset in mongo db

        # event = ProjectPreviewImageUpdatedEvent.from_props(command.project_id, command.asset_id)
