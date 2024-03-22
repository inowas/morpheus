import dataclasses

from morpheus.common.infrastructure.files.FileService import FileService
from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import NotFoundException
from morpheus.common.types.File import FileName, FilePath
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from ..read.PermissionsReader import permissions_reader
from ..read.ProjectsReader import projects_reader
from ...domain.AssetService import AssetService

from ...domain.events.ProjectEvents import ProjectCreatedEvent, ProjectMetadataUpdatedEvent, ProjectPreviewImageUpdatedEvent
from ...infrastructure.assets.AssetFileStorage import asset_file_storage
from ...infrastructure.assets.PreviewImageService import preview_image_service
from ...infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from ...types.Asset import AssetId, Asset, AssetType
from ...types.Project import ProjectId, Project, Description, Name, Tags
from ...types.User import UserId


@dataclasses.dataclass(frozen=True)
class CreateProjectCommand:
    project_id: ProjectId
    name: Name
    description: Description
    tags: Tags
    created_by: UserId


class CreateProjectCommandHandler:

    @staticmethod
    def handle(command: CreateProjectCommand):
        project = Project.new(user_id=command.created_by, project_id=command.project_id)
        metadata = project.metadata.with_updated_name(command.name).with_updated_description(command.description).with_updated_tags(command.tags)
        project = project.with_updated_metadata(metadata)

        event = ProjectCreatedEvent.from_project(project=project, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(command.created_by.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)


@dataclasses.dataclass(frozen=True)
class UpdateMetadataCommand:
    project_id: ProjectId
    name: Name | None
    description: Description | None
    tags: Tags | None
    updated_by: UserId


class UpdateMetadataCommandHandler:
    @staticmethod
    def handle(command: UpdateMetadataCommand) -> None:
        project_id = command.project_id
        if not projects_reader.project_exists(project_id):
            raise NotFoundException(f'Project with id {project_id.to_str()} does not exist')

        # todo assert user has access to project

        event = ProjectMetadataUpdatedEvent.from_props(project_id=project_id, name=command.name, description=command.description, tags=command.tags, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(command.updated_by.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)


@dataclasses.dataclass(frozen=True)
class UpdatePreviewImageCommand:
    project_id: ProjectId
    asset_id: AssetId
    file_name: FileName
    file_path: FilePath
    updated_by: UserId


class UpdatePreviewImageCommandHandler:
    @staticmethod
    def handle(command: UpdatePreviewImageCommand) -> None:
        if not projects_reader.project_exists(command.project_id):
            raise NotFoundException(f'Project with id {command.project_id.to_str()} does not exist')

        # todo assert user has access to project
        permissions = permissions_reader.get_permissions(command.project_id)
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

        event = ProjectPreviewImageUpdatedEvent.from_props(command.project_id, command.asset_id)



