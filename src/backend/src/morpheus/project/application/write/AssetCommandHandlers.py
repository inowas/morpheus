import dataclasses

from werkzeug.utils import secure_filename

from morpheus.common.infrastructure.files.FileService import FileService
from morpheus.common.types import Uuid
from morpheus.common.types.Exceptions import NotFoundException
from morpheus.common.types.File import FileName, FilePath
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from ..read.AssetReader import asset_reader
from ..read.ProjectReader import project_reader
from ...domain.AssetService import AssetService
from ...domain.events.ProjectEvents import ProjectPreviewImageUpdatedEvent, ProjectPreviewImageDeletedEvent
from ...infrastructure.assets.AssetHandlingService import asset_handling_service
from ...infrastructure.assets.GeoTiffService import geo_tiff_service
from ...infrastructure.assets.PreviewImageService import preview_image_service
from ...infrastructure.assets.ShapefileService import shapefile_service
from ...infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from ...infrastructure.persistence.AssetRepository import asset_repository
from ...infrastructure.persistence.PreviewImageRepository import preview_image_repository
from ...types.Asset import AssetId, Asset, AssetType, AssetDescription
from ...types.Project import ProjectId
from ...types.User import UserId


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
        project_reader.assert_project_exists(command.project_id)

        # TODO check permissions

        # check if file can be used as preview image
        file = FileService.build_file_info(command.file_path, command.file_name)
        AssetService.assert_file_can_be_used_as_preview_image(file)

        # prepare preview image asset
        preview_image_service.resize_as_preview_image(command.file_path)
        metadata = preview_image_service.extract_asset_metadata(command.file_path)
        asset = Asset(
            asset_id=command.asset_id,
            project_id=command.project_id,
            type=AssetType.IMAGE,
            file=file,
            metadata=metadata
        )

        # delete existing asset
        existing_asset_id = preview_image_repository.get_preview_image(command.project_id)
        if existing_asset_id is not None:
            asset_handling_service.delete_asset_by_id(existing_asset_id)

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
        project_reader.assert_project_exists(command.project_id)

        # TODO check permissions

        existing_asset_id = preview_image_repository.get_preview_image(command.project_id)
        if existing_asset_id is None:
            return

        # remove asset preview image for project
        event = ProjectPreviewImageDeletedEvent.occurred_now(command.project_id)
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(command.updated_by.to_str()))
        project_event_bus.record(EventEnvelope(event=event, metadata=event_metadata))

        # delete existing asset
        if existing_asset_id is not None:
            asset_handling_service.delete_asset_by_id(existing_asset_id)


@dataclasses.dataclass(frozen=True)
class UploadAssetCommand:
    project_id: ProjectId
    asset_id: AssetId
    file_name: FileName
    file_path: FilePath
    description: AssetDescription | None
    updated_by: UserId


class UploadAssetCommandHandler:
    @staticmethod
    def handle(command: UploadAssetCommand) -> None:
        project_reader.assert_project_exists(command.project_id)

        # TODO check permissions

        file = FileService.build_file_info(command.file_path, command.file_name)
        asset_type = AssetService.guess_asset_type_for_file(file)

        if asset_type == AssetType.SHAPEFILE:
            metadata = shapefile_service.extract_asset_metadata(command.file_path)
        elif asset_type == AssetType.GEO_TIFF:
            metadata = geo_tiff_service.extract_asset_metadata(command.file_path)
        else:
            raise ValueError(f'Invalid asset type: {asset_type}')

        asset = Asset(
            asset_id=command.asset_id,
            project_id=command.project_id,
            type=asset_type,
            file=file,
            metadata=metadata,
            description=command.description,
        )

        # persist new asset
        asset_handling_service.persist_asset(asset, command.file_path)


@dataclasses.dataclass(frozen=True)
class DeleteAssetCommand:
    project_id: ProjectId
    asset_id: AssetId


class DeleteAssetCommandHandler:
    @staticmethod
    def handle(command: DeleteAssetCommand) -> None:
        project_reader.assert_project_exists(command.project_id)

        # TODO check permissions

        asset = asset_reader.get_asset(command.project_id, command.asset_id)
        if asset is None:
            raise NotFoundException(f'Asset {command.asset_id.to_str()} for project {command.project_id.to_str()} not found')

        asset_handling_service.delete_asset(asset)


@dataclasses.dataclass(frozen=True)
class UpdateAssetCommand:
    project_id: ProjectId
    asset_id: AssetId
    file_name: FileName | None
    description: AssetDescription | None

    def __post_init__(self):
        if self.file_name is None and self.description is None:
            raise ValueError('At least one field must be set')


class UpdateAssetCommandHandler:
    @staticmethod
    def handle(command: UpdateAssetCommand) -> None:
        project_reader.assert_project_exists(command.project_id)

        # TODO check permissions

        asset = asset_reader.get_asset(command.project_id, command.asset_id)
        if asset is None:
            raise NotFoundException(f'Asset {command.asset_id.to_str()} for project {command.project_id.to_str()} not found')

        if command.file_name is not None:
            new_file_name = FileName(secure_filename(command.file_name))

            AssetService.assert_filename_can_be_changed_for_asset(asset, new_file_name)

        asset_repository.update_asset(
            asset.asset_id,
            file_name=command.file_name,
            description=command.description,
        )