import dataclasses
from typing import TypedDict

from morpheus.common.types.Exceptions import NotFoundException
from morpheus.common.types.File import FileName
from morpheus.common.types.identity.Identity import UserId

from morpheus.project.application.read.AssetReader import get_asset_reader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.AssetService import AssetService
from morpheus.project.infrastructure.assets.AssetHandlingService import get_asset_handling_service
from morpheus.project.types.Asset import AssetId
from morpheus.project.types.Project import ProjectId


class UpdateAssetFileNameCommandPayload(TypedDict):
    project_id: str
    asset_id: str
    asset_file_name: str


@dataclasses.dataclass(frozen=True)
class UpdateAssetFileNameCommand(ProjectCommandBase):
    asset_id: AssetId
    asset_file_name: FileName

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateAssetFileNameCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            asset_id=AssetId.from_str(payload['asset_id']),
            asset_file_name=FileName(payload['asset_file_name'])
        )


class UpdateAssetFileNameCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateAssetFileNameCommand):
        asset_reader = get_asset_reader()
        asset = asset_reader.get_asset(command.project_id, command.asset_id)
        if asset is None:
            raise NotFoundException(f'Asset {command.asset_id.to_str()} for project {command.project_id.to_str()} not found')

        asset_service = AssetService()
        asset_service.assert_filename_can_be_changed_for_asset(asset, command.asset_file_name)

        asset_handling_service = get_asset_handling_service()
        asset_handling_service.update_asset_file_name(asset_id=asset.asset_id, file_name=command.asset_file_name)
