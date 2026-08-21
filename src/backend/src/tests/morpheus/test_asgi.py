from io import BytesIO
from unittest.mock import patch

from fastapi.testclient import TestClient

from morpheus.asgi import app
from morpheus.authentication.outgoing import identity_context
from morpheus.project.presentation.api.read.models.ReadModelGridRequestHandler import ReadModelGridRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelLayerPropertyImageRequestHandler import GeneratedImage, ReadModelLayerPropertyImageRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelRequestHandler import ReadModelRequestHandler
from morpheus.project.presentation.api.read.projects.ReadProjectListRequestHandler import ReadProjectListRequestHandler
from morpheus.project.presentation.api.read.projects.ReadProjectMetadataRequestHandler import ReadProjectMetadataRequestHandler
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
def test_groups_forbidden_for_non_admin(mock_authenticate):
    mock_authenticate.side_effect = lambda token: (identity_context.set({'user_id': 'user-1', 'group_ids': [], 'is_admin': False}), True)[1]

    response = client.get('/users/groups', headers={'Authorization': 'Bearer valid-token'})

    assert response.status_code == 403


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
    mock_handle.return_value = ([{
        'project_id': 'project-1',
        'name': 'Example',
        'description': 'Description',
        'tags': [],
        'owner_id': 'user-1',
        'is_public': False,
        'created_at': '2024-01-01T00:00:00Z',
        'updated_at': '2024-01-01T00:00:00Z',
        'user_privileges': ['view_project'],
    }], 200)

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
