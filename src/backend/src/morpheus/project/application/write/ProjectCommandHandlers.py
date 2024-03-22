import dataclasses

from morpheus.common.infrastructure.files.FileService import FileService
from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.File import FileName, FilePath
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from ...domain.AssetService import AssetService
from ...domain.events.ProjectEvents import ProjectCreatedEvent, ProjectMetadataUpdatedEvent, ProjectPreviewImageUpdatedEvent, ProjectPreviewImageDeletedEvent
from ...infrastructure.assets.AssetHandlingService import asset_handling_service
from ...infrastructure.assets.PreviewImageService import preview_image_service
from ...infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from ...infrastructure.persistence.PreviewImageRepository import preview_image_repository
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
        event = ProjectMetadataUpdatedEvent.from_props(project_id=command.project_id, name=command.name,
                                                       description=command.description, tags=command.tags, occurred_at=DateTime.now())
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
        # check if file can be used as preview image
        file = FileService.build_file_info(command.file_path, command.file_name)
        AssetService.assert_file_can_be_used_as_preview_image(file)

        # prepare preview image asset
        preview_image_service.resize_as_preview_image(command.file_path)
        metadata = preview_image_service.extract_asset_metadata(command.file_path)
        asset = Asset(
            id=command.asset_id,
            project_id=command.project_id,
            type=AssetType.IMAGE,
            file=file,
            metadata=metadata
        )

        # delete existing asset
        existing_asset_id = preview_image_repository.get_preview_image(command.project_id)
        if existing_asset_id is not None:
            asset_handling_service.delete_asset(existing_asset_id)

        # persist new asset
        asset_handling_service.persist_asset(asset, command.file_path)

        # set asset as preview image for project
        event = ProjectPreviewImageUpdatedEvent.occurred_now(command.project_id, command.asset_id)
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(command.updated_by.to_str()))
        project_event_bus.record(EventEnvelope(event=event, metadata=event_metadata))


@dataclasses.dataclass(frozen=True)
class DeletePreviewImageCommand:
    project_id: ProjectId
    updated_by: UserId


class DeletePreviewImageCommandHandler:
    @staticmethod
    def handle(command: DeletePreviewImageCommand) -> None:
        existing_asset_id = preview_image_repository.get_preview_image(command.project_id)
        if existing_asset_id is None:
            return

        # remove asset preview image for project
        event = ProjectPreviewImageDeletedEvent.occurred_now(command.project_id)
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(command.updated_by.to_str()))
        project_event_bus.record(EventEnvelope(event=event, metadata=event_metadata))

        # delete existing asset
        if existing_asset_id is not None:
            asset_handling_service.delete_asset(existing_asset_id)
