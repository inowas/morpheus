import dataclasses
import magic
import os

from morpheus.assets.infrastructure.persistence.AssetRepository import asset_repository
from morpheus.assets.types.Asset import AssetId, Asset, AssetType
from morpheus.assets.types.File import File
from morpheus.assets.types.User import UserId


@dataclasses.dataclass(frozen=True)
class UploadAssetCommand:
    asset_id: AssetId
    asset_type: AssetType
    user_id: UserId
    file_path: str


class UploadAssetCommandHandler:
    @staticmethod
    def handle(command: UploadAssetCommand):
        filename = os.path.basename(command.file_path)
        size = os.path.getsize(command.file_path)
        mimetype = magic.from_file(command.file_path, mime=True)

        # todo check if asset type is valid for mimetype

        file = File(filename=filename, size=size, mimetype=mimetype)
        asset = Asset(id=command.asset_id, type=command.asset_type, file=file)

        asset_repository.add_asset(asset=asset)


@dataclasses.dataclass(frozen=True)
class DeleteAssetCommand:
    asset_id: AssetId


class DeleteAssetCommandHandler:
    @staticmethod
    def handle(command: DeleteAssetCommand):
        file = asset_repository.get_file(asset_id=command.asset_id)
        asset_repository.delete_asset(asset_id=command.asset_id)
        os.remove(file.filename)

