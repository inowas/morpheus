from io import BytesIO
from unittest.mock import patch

from fastapi.testclient import TestClient

from morpheus.asgi import app
from morpheus.authentication.outgoing import identity_context
from morpheus.project.presentation.api.read.assets.DownloadAssetRequestHandler import DownloadAssetRequestHandler
from morpheus.project.presentation.api.read.assets.ReadAssetDataRequestHandler import ReadAssetDataRequestHandler
from morpheus.project.presentation.api.read.assets.ReadAssetListRequestHandler import ReadAssetListRequestHandler
from morpheus.project.presentation.api.read.calculations.ReadCalculationBudgetResultsRequestHandler import ReadCalculationBudgetResultsRequestHandler
from morpheus.project.presentation.api.read.calculations.ReadCalculationsRequestHandler import ReadCalculationsRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelGridRequestHandler import ReadModelGridRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelLayerPropertyImageRequestHandler import GeneratedImage, ReadModelLayerPropertyImageRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelRequestHandler import ReadModelRequestHandler
from morpheus.project.presentation.api.read.projects.ReadProjectListRequestHandler import ReadProjectListRequestHandler
from morpheus.project.presentation.api.read.projects.ReadProjectMetadataRequestHandler import ReadProjectMetadataRequestHandler
from morpheus.project.presentation.api.write.assets.DeletePreviewImageRequestHandler import DeletePreviewImageRequestHandler
from morpheus.project.presentation.api.write.assets.UploadAssetRequestHandler import UploadAssetRequestHandler
from morpheus.project.presentation.api.write.assets.UploadPreviewImageRequestHandler import UploadPreviewImageRequestHandler
from morpheus.sensor.application.read.ReadSensorData import InvalidTimeResolutionException
from morpheus.user.presentation.api.read.GetUsersRequestHandler import UserResponseItem

client = TestClient(app)


def test_healthcheck():
    response = client.get('/healthcheck')

    assert response.status_code == 200
    assert response.text == 'OK'


def test_schema():
    response = client.get('/schema')

    assert response.status_code == 200
    assert '/healthcheck' in response.json()['paths']
    assert response.json() == app.openapi()


def test_cors_preflight_allows_any_origin():
    response = client.options(
        '/users/me',
        headers={
            'Origin': 'https://any.example.com',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'authorization',
        },
    )

    assert response.status_code == 200
    assert response.headers['access-control-allow-origin'] == '*'
    assert 'authorization' in response.headers['access-control-allow-headers'].lower()


@patch('morpheus.sensor.router.ReadSensorListRequestHandler.handle')
def test_sensors(mock_handle):
    mock_handle.return_value = ([{'id': 'sensor-1', 'location': [13.4, 52.5], 'project': 'BRA1', 'name': 'Sensor 1', 'parameters': ['head']}], 200)

    response = client.get('/sensors')

    assert response.status_code == 200
    assert response.json()[0]['id'] == 'sensor-1'


@patch('morpheus.sensor.router.ReadSensorsLatestValuesRequestHandler.handle')
def test_sensors_latest(mock_handle):
    mock_handle.return_value = ({'sensor-1': {'head': 12.5}}, 200)

    response = client.get('/sensors/latest')

    assert response.status_code == 200
    assert response.json() == {'sensor-1': {'head': 12.5}}


@patch('morpheus.sensor.router.ReadSensorDataRequestHandler.handle')
def test_sensor_data_parses_query_parameters(mock_handle):
    mock_handle.return_value = [{'date_time': '2024-01-01T00:00:00Z', 'value': 12.5}]

    response = client.get('/sensors/project/BRA1/sensor/1/parameter/head?gte=10&time_resolution=RAW')

    assert response.status_code == 200
    assert response.json()[0]['value'] == 12.5
    request = mock_handle.call_args.args[0]
    assert request.gte == 10
    assert request.time_resolution == 'RAW'


@patch('morpheus.sensor.router.ReadSensorDataRequestHandler.handle', side_effect=InvalidTimeResolutionException('invalid resolution'))
def test_sensor_data_returns_bad_request_for_invalid_query(mock_handle):
    response = client.get('/sensors/project/BRA1/sensor/1/parameter/head')

    assert response.status_code == 400
    assert response.json() == {'error': 'invalid resolution'}


def test_users_require_authentication():
    assert client.get('/users').status_code == 401


def test_current_user_requires_authentication():
    assert client.get('/users/me').status_code == 401


def test_groups_require_authentication():
    assert client.get('/users/groups').status_code == 401


@patch('morpheus.fastapi_auth.authenticate_token')
@patch('morpheus.user.router.GetUsersRequestHandler.handle')
def test_users_use_authenticated_identity(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]
    mock_handle.return_value = [UserResponseItem(user_id='user-1', is_admin=False, email='user@example.com', username='user', first_name=None, last_name=None)]

    response = client.get('/users', headers={'Authorization': 'Bearer valid-token'})

    assert response.status_code == 200
    assert response.json()[0]['user_id'] == 'user-1'
    mock_authenticate.assert_called_once_with('valid-token')


@patch('morpheus.fastapi_auth.authenticate_token')
@patch('morpheus.user.router.GetGroupsRequestHandler.handle')
def test_groups_allowed_for_non_admin(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]
    mock_handle.return_value = []

    response = client.get('/users/groups', headers={'Authorization': 'Bearer valid-token'})

    assert response.status_code == 200
    assert response.json() == []


@patch('morpheus.fastapi_auth.authenticate_token')
@patch('morpheus.user.router.GetGroupsRequestHandler.handle')
def test_groups_allowed_for_admin(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'admin-1', 'group_ids': [], 'is_admin': True}), True)[1]
    mock_handle.return_value = []

    response = client.get('/users/groups', headers={'Authorization': 'Bearer valid-token'})

    assert response.status_code == 200
    assert response.json() == []


def test_projects_require_authentication():
    assert client.get('/projects').status_code == 401


@patch('morpheus.fastapi_auth.authenticate_token')
@patch.object(ReadProjectListRequestHandler, 'handle')
def test_projects_return_typed_response(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]
    mock_handle.return_value = (
        [
            {
                'project_id': 'project-1',
                'name': 'Example',
                'description': 'Description',
                'tags': [],
                'owner_id': 'user-1',
                'is_public': False,
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z',
                'user_privileges': ['view_project'],
            }
        ],
        200,
    )

    response = client.get('/projects', headers={'Authorization': 'Bearer valid-token'})

    assert response.status_code == 200
    assert response.json()[0]['name'] == 'Example'


def test_project_metadata_requires_authentication():
    assert client.get('/projects/project-1/metadata').status_code == 401


@patch('morpheus.fastapi_auth.authenticate_token')
@patch.object(ReadProjectMetadataRequestHandler, 'handle', return_value=({'message': 'Project not found'}, 404))
def test_project_metadata_maps_not_found(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]

    response = client.get('/projects/project-1/metadata', headers={'Authorization': 'Bearer valid-token'})

    assert response.status_code == 404


def test_project_privileges_requires_authentication():
    assert client.get('/projects/project-1/privileges').status_code == 401


def test_model_reads_require_authentication():
    paths = [
        '/projects/project-1/model',
        '/projects/project-1/model/calculation',
        '/projects/project-1/model/spatial-discretization',
        '/projects/project-1/model/spatial-discretization/affected-cells',
        '/projects/project-1/model/spatial-discretization/grid',
        '/projects/project-1/model/time-discretization',
        '/projects/project-1/model/layers',
        '/projects/project-1/model/boundaries',
        '/projects/project-1/model/boundaries/boundary-1',
        '/projects/project-1/model/head-observations',
        '/projects/project-1/model/head-observations/observation-1',
    ]

    assert all(client.get(path).status_code == 401 for path in paths)


@patch('morpheus.fastapi_auth.authenticate_token')
@patch.object(ReadModelRequestHandler, 'handle', return_value={'model_id': 'model-1'})
def test_model_returns_handler_response(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]

    response = client.get('/projects/123e4567-e89b-12d3-a456-426614174000/model', headers={'Authorization': 'Bearer valid-token'})

    assert response.status_code == 200
    assert response.json() == {'model_id': 'model-1'}
    mock_handle.assert_called_once()


@patch('morpheus.fastapi_auth.authenticate_token')
@patch.object(ReadModelGridRequestHandler, 'handle', return_value=({'grid': True}, 200))
def test_model_grid_passes_query_format(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]

    response = client.get(
        '/projects/123e4567-e89b-12d3-a456-426614174000/model/spatial-discretization/grid?format=geojson',
        headers={'Authorization': 'Bearer valid-token'},
    )

    assert response.status_code == 200
    assert response.json() == {'grid': True}
    assert mock_handle.call_args.args[1] == 'geojson'


def test_model_layer_property_image_requires_authentication():
    assert client.get('/projects/project-1/model/layers/layer-1/properties/head/image').status_code == 401


@patch('morpheus.fastapi_auth.authenticate_token')
@patch.object(ReadModelLayerPropertyImageRequestHandler, 'handle')
def test_model_layer_property_image_returns_png(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]
    mock_handle.return_value = GeneratedImage(BytesIO(b'png-data'), 'image/png')

    response = client.get(
        '/projects/123e4567-e89b-12d3-a456-426614174000/model/layers/123e4567-e89b-12d3-a456-426614174001/properties/hk/image?format=grid',
        headers={'Authorization': 'Bearer valid-token'},
    )

    assert response.status_code == 200
    assert response.headers['content-type'] == 'image/png'
    assert response.headers['cache-control'] == 'no-cache'
    assert response.content == b'png-data'
    assert mock_handle.call_args.kwargs['output_format'].value == 'grid'


def test_calculation_reads_require_authentication():
    paths = [
        '/projects/project-1/calculations',
        '/projects/project-1/calculations/calculation-1',
        '/projects/project-1/calculations/calculation-1/files/output.dat',
        '/projects/project-1/calculations/calculation-1/results/budget/flow',
        '/projects/project-1/calculations/calculation-1/results/layer/head',
        '/projects/project-1/calculations/calculation-1/results/observation/head',
        '/projects/project-1/calculations/calculation-1/results/time_series/head',
    ]

    assert all(client.get(path).status_code == 401 for path in paths)


@patch('morpheus.fastapi_auth.authenticate_token')
@patch.object(ReadCalculationsRequestHandler, 'handle', return_value=([{'calculation_id': 'calculation-1'}], 200))
def test_calculations_return_handler_response(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]

    response = client.get('/projects/123e4567-e89b-12d3-a456-426614174000/calculations', headers={'Authorization': 'Bearer valid-token'})

    assert response.status_code == 200
    assert response.json() == [{'calculation_id': 'calculation-1'}]
    mock_handle.assert_called_once()


@patch('morpheus.fastapi_auth.authenticate_token')
@patch.object(ReadCalculationBudgetResultsRequestHandler, 'handle', return_value=({'result_type': 'flow'}, 200))
def test_calculation_budget_passes_query_parameters(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]

    response = client.get(
        '/projects/123e4567-e89b-12d3-a456-426614174000/calculations/123e4567-e89b-12d3-a456-426614174001/results/budget/flow?time_idx=3&incremental=true',
        headers={'Authorization': 'Bearer valid-token'},
    )

    assert response.status_code == 200
    assert response.json() == {'result_type': 'flow'}
    assert mock_handle.call_args.kwargs['time_idx'] == 3
    assert mock_handle.call_args.kwargs['incremental'] is True


def test_asset_reads_require_authentication():
    paths = [
        '/projects/project-1/assets',
        '/projects/project-1/assets/123e4567-e89b-12d3-a456-426614174000',
        '/projects/project-1/assets/123e4567-e89b-12d3-a456-426614174000/file',
        '/projects/project-1/assets/123e4567-e89b-12d3-a456-426614174000/data',
    ]

    assert all(client.get(path).status_code == 401 for path in paths)
    assert client.get('/projects/project-1/preview_image').status_code == 404


@patch('morpheus.fastapi_auth.authenticate_token')
@patch.object(ReadAssetListRequestHandler, 'handle', return_value=({'assets': []}, 200))
def test_assets_pass_filters_and_pagination(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]

    response = client.get(
        '/projects/123e4567-e89b-12d3-a456-426614174000/assets?asset_type=geo_tiff&file_name=data.tif&description=demo&page=2&page_size=5',
        headers={'Authorization': 'Bearer valid-token'},
    )

    assert response.status_code == 200
    assert response.json() == {'assets': []}
    assert mock_handle.call_args.args[1:] == ('geo_tiff', 'data.tif', 'demo', 2, 5)


@patch('morpheus.fastapi_auth.authenticate_token')
@patch.object(ReadAssetDataRequestHandler, 'handle', return_value=({'data': []}, 200))
def test_asset_data_passes_band(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]

    response = client.get(
        '/projects/123e4567-e89b-12d3-a456-426614174000/assets/123e4567-e89b-12d3-a456-426614174001/data?band=2',
        headers={'Authorization': 'Bearer valid-token'},
    )

    assert response.status_code == 200
    assert mock_handle.call_args.args[2] == 2


@patch('morpheus.fastapi_auth.authenticate_token')
@patch.object(DownloadAssetRequestHandler, 'handle')
def test_download_asset_returns_file_response(mock_handle, mock_authenticate, tmp_path):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]
    file_path = tmp_path / 'example.tif'
    file_path.write_bytes(b'tiff-data')
    mock_handle.return_value = (str(file_path), 'image/tiff', 'example.tif')

    response = client.get(
        '/projects/123e4567-e89b-12d3-a456-426614174000/assets/123e4567-e89b-12d3-a456-426614174001/file',
        headers={'Authorization': 'Bearer valid-token'},
    )

    assert response.status_code == 200
    assert response.headers['content-type'] == 'image/tiff'
    assert 'example.tif' in response.headers['content-disposition']


def test_asset_upload_requires_authentication():
    response = client.post('/projects/project-1/assets', files={'file': ('example.tif', b'tiff-data', 'image/tiff')})

    assert response.status_code == 401


@patch('morpheus.fastapi_auth.authenticate_token')
@patch.object(UploadAssetRequestHandler, 'handle', return_value=({'location': 'projects/project-1/assets/asset-1'}, 201))
def test_asset_upload_returns_location(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]

    response = client.post(
        '/projects/123e4567-e89b-12d3-a456-426614174000/assets',
        files={'file': ('example.tif', b'tiff-data', 'image/tiff')},
        data={'description': 'demo'},
        headers={'Authorization': 'Bearer valid-token'},
    )

    assert response.status_code == 201
    assert response.headers['location'] == 'projects/project-1/assets/asset-1'
    assert mock_handle.call_args.args[3] == 'demo'


@patch('morpheus.fastapi_auth.authenticate_token')
@patch.object(UploadPreviewImageRequestHandler, 'handle', return_value=('', 204))
def test_preview_upload_returns_no_content(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]

    response = client.put(
        '/projects/123e4567-e89b-12d3-a456-426614174000/preview_image',
        files={'file': ('preview.png', b'png-data', 'image/png')},
        headers={'Authorization': 'Bearer valid-token'},
    )

    assert response.status_code == 204
    mock_handle.assert_called_once()


def test_preview_delete_requires_authentication():
    assert client.delete('/projects/project-1/preview_image').status_code == 401


@patch('morpheus.fastapi_auth.authenticate_token')
@patch.object(DeletePreviewImageRequestHandler, 'handle', return_value=('', 204))
def test_preview_delete_returns_no_content(mock_handle, mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]

    response = client.delete('/projects/123e4567-e89b-12d3-a456-426614174000/preview_image', headers={'Authorization': 'Bearer valid-token'})

    assert response.status_code == 204
    mock_handle.assert_called_once()
