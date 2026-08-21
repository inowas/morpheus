from unittest.mock import patch

from fastapi.testclient import TestClient

from morpheus.asgi import app
from morpheus.sensor.application.read.ReadSensorData import InvalidTimeResolutionException

client = TestClient(app)


def test_healthcheck():
    response = client.get('/healthcheck')

    assert response.status_code == 200
    assert response.text == 'OK'


def test_schema():
    response = client.get('/schema')

    assert response.status_code == 200
    assert '/healthcheck' in response.json()['paths']


@patch('morpheus.asgi.ReadSensorListRequestHandler.handle')
def test_sensors(mock_handle):
    mock_handle.return_value = ([{'id': 'sensor-1', 'location': [13.4, 52.5], 'project': 'BRA1', 'name': 'Sensor 1', 'parameters': ['head']}], 200)

    response = client.get('/sensors')

    assert response.status_code == 200
    assert response.json()[0]['id'] == 'sensor-1'


@patch('morpheus.asgi.ReadSensorsLatestValuesRequestHandler.handle')
def test_sensors_latest(mock_handle):
    mock_handle.return_value = ({'sensor-1': {'head': 12.5}}, 200)

    response = client.get('/sensors/latest')

    assert response.status_code == 200
    assert response.json() == {'sensor-1': {'head': 12.5}}


@patch('morpheus.asgi.ReadSensorDataRequestHandler.handle')
def test_sensor_data_parses_query_parameters(mock_handle):
    mock_handle.return_value = [{'date_time': '2024-01-01T00:00:00Z', 'value': 12.5}]

    response = client.get('/sensors/project/BRA1/sensor/1/parameter/head?gte=10&time_resolution=RAW')

    assert response.status_code == 200
    assert response.json()[0]['value'] == 12.5
    request = mock_handle.call_args.args[0]
    assert request.gte == 10
    assert request.time_resolution == 'RAW'


@patch('morpheus.asgi.ReadSensorDataRequestHandler.handle', side_effect=InvalidTimeResolutionException('invalid resolution'))
def test_sensor_data_returns_bad_request_for_invalid_query(mock_handle):
    response = client.get('/sensors/project/BRA1/sensor/1/parameter/head')

    assert response.status_code == 400
    assert response.json() == {'error': 'invalid resolution'}
