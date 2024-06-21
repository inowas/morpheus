import dataclasses
from typing import TypedDict

from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.read.AssetReader import get_asset_reader
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.infrastructure.assets.AssetHandlingService import get_asset_handling_service
from morpheus.project.types.Asset import AssetId, AssetDescription
from morpheus.project.types.Project import ProjectId


class UpdateAssetDescriptionCommandPayload(TypedDict):
    project_id: str
    asset_id: str
    asset_description: str


@dataclasses.dataclass(frozen=True)
class UpdateAssetDescriptionCommand(CommandBase):
    project_id: ProjectId
    asset_id: AssetId
    asset_description: AssetDescription

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateAssetDescriptionCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            asset_id=AssetId.from_str(payload['asset_id']),
            asset_description=AssetDescription.from_str(payload['asset_description'])
        )


class UpdateAssetDescriptionCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateAssetDescriptionCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the time discretization of {project_id.to_str()}')

        asset_reader = get_asset_reader()
        asset = asset_reader.get_asset(command.project_id, command.asset_id)
        if asset is None:
            raise NotFoundException(f'Asset {command.asset_id.to_str()} for project {command.project_id.to_str()} not found')

        asset_handling_service = get_asset_handling_service()
        asset_handling_service.update_asset_description(asset_id=asset.asset_id, description=command.asset_description)
