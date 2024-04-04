import dataclasses

from morpheus.common.infrastructure.files.FileService import FileService
from morpheus.common.types.Exceptions import NotFoundException
from morpheus.common.types.File import FileName, FilePath
from morpheus.project.application.read.ProjectsReader import projects_reader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.AssetService import AssetService
from morpheus.project.infrastructure.assets.AssetFileStorage import asset_file_storage
from morpheus.project.infrastructure.assets.PreviewImageService import preview_image_service
from morpheus.project.types.Asset import AssetId, Asset, AssetType
from morpheus.project.types.Project import ProjectId


@dataclasses.dataclass(frozen=True)
class UpdateProjectPreviewImageCommand(CommandBase):
    project_id: ProjectId
    asset_id: AssetId
    file_name: FileName
    file_path: FilePath


class UpdateProjectPreviewImageCommandHandler(CommandHandlerBase):
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
