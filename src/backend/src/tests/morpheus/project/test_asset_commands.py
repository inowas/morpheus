from pathlib import Path

import pytest

from morpheus.common.types.File import File, FileName, FilePath, FileSize, MimeType
from morpheus.project.application.read.AssetReader import get_asset_reader
from morpheus.project.application.write.Asset import (
    DeleteAssetCommand,
    UpdateAssetDescriptionCommand,
    UpdateAssetFileNameCommand,
)
from morpheus.project.infrastructure.assets.AssetHandlingService import get_asset_handling_service
from morpheus.project.types.Asset import Asset, AssetDescription, AssetId, AssetType, ImageMetadata

pytestmark = [pytest.mark.integration, pytest.mark.asset]


@pytest.fixture
def asset_context(setup_project, user_id, command_bus, tmp_path):
    asset_id = AssetId.new()
    source_path = Path(tmp_path) / 'source.txt'
    source_path.write_text('test asset', encoding='utf-8')
    asset = Asset(
        asset_id=asset_id,
        project_id=setup_project,
        type=AssetType.IMAGE,
        file=File(file_name=FileName('source.txt'), size_in_bytes=FileSize(10), mime_type=MimeType('text/plain')),
        metadata=ImageMetadata(width=10, height=10),
        description=AssetDescription('Original description'),
    )
    get_asset_handling_service().persist_asset(asset, FilePath(str(source_path)))
    return {'project_id': setup_project, 'asset': asset, 'user_id': user_id, 'command_bus': command_bus}


def get_asset(context):
    asset = get_asset_reader().get_asset(context['project_id'], context['asset'].asset_id)
    assert asset is not None
    return asset


def test_asset_is_persisted_with_file(asset_context):
    context = asset_context
    asset = get_asset(context)

    assert asset.file.file_name == 'source.txt'
    assert asset.description.to_str() == 'Original description'
    assert Path(get_asset_handling_service().get_full_path_to_asset(asset)).exists()


def test_update_asset_description(asset_context):
    context = asset_context
    context['command_bus'].dispatch(
        UpdateAssetDescriptionCommand(
            project_id=context['project_id'], asset_id=context['asset'].asset_id, asset_description=AssetDescription('Updated description'), user_id=context['user_id']
        )
    )

    assert get_asset(context).description.to_str() == 'Updated description'


def test_update_asset_file_name(asset_context):
    context = asset_context
    context['command_bus'].dispatch(
        UpdateAssetFileNameCommand(project_id=context['project_id'], asset_id=context['asset'].asset_id, asset_file_name=FileName('renamed.txt'), user_id=context['user_id'])
    )

    assert get_asset(context).file.file_name == 'renamed.txt'


def test_delete_asset_removes_metadata_and_file(asset_context):
    context = asset_context
    asset = get_asset(context)
    path = Path(get_asset_handling_service().get_full_path_to_asset(asset))

    context['command_bus'].dispatch(DeleteAssetCommand(project_id=context['project_id'], asset_id=asset.asset_id, user_id=context['user_id']))

    assert get_asset_reader().get_asset(context['project_id'], asset.asset_id) is None
    assert not path.exists()
