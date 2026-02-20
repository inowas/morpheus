import dataclasses
from typing import TypedDict

from morpheus.common.types.Exceptions import NotFoundException
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.read.AssetReader import get_asset_reader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.AssetService import AssetService
from morpheus.project.infrastructure.assets.AssetHandlingService import get_asset_handling_service
from morpheus.project.types.Asset import AssetId, GeoTiffMetadata, NoDataValue
from morpheus.project.types.Project import ProjectId


class UpdateRasterAssetNoDataValueCommandPayload(TypedDict):
    project_id: str
    asset_id: str
    no_data_value: float | int


@dataclasses.dataclass(frozen=True)
class UpdateRasterAssetNoDataValueCommand(ProjectCommandBase):
    asset_id: AssetId
    no_data_value: NoDataValue

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateRasterAssetNoDataValueCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            asset_id=AssetId.from_str(payload['asset_id']),
            no_data_value=NoDataValue.from_float(float(payload['no_data_value'])),
        )


class UpdateRasterAssetNoDataValueCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateRasterAssetNoDataValueCommand):
        asset_reader = get_asset_reader()
        asset = asset_reader.get_asset(command.project_id, command.asset_id)
        if asset is None:
            raise NotFoundException(f'Asset {command.asset_id.to_str()} for project {command.project_id.to_str()} not found')

        asset_service = AssetService()
        asset_service.assert_no_data_value_can_be_changed_for_asset(asset)

        asset_handling_service = get_asset_handling_service()
        if not isinstance(asset.metadata, GeoTiffMetadata):
            raise ValueError(f'Asset {command.asset_id.to_str()} for project {command.project_id.to_str()} is not a GeoTiff asset')

        asset_handling_service.update_asset_metadata(asset_id=asset.asset_id, metadata=asset.metadata.with_updated_no_data_value(command.no_data_value))
