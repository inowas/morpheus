from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from morpheus.sensor.application.read.ReadSensorData import InvalidDateFormatException, InvalidTimeResolutionException, SensorNotFoundException
from morpheus.sensor.presentation.api import ReadSensorListRequestHandler, ReadSensorsLatestValuesRequestHandler
from morpheus.sensor.presentation.api.ReadSensorDataRequestHandler import ReadSensorDataRequest, ReadSensorDataRequestHandler, SensorDataResponse
from morpheus.sensor.presentation.api.ReadSensorListRequestHandler import SensorListResponse
from morpheus.sensor.presentation.api.ReadSensorsLatestValuesRequestHandler import SensorsLatestValuesResponse

router = APIRouter(prefix='/sensors', tags=['Sensors'])


@router.get(
    '',
    response_model=SensorListResponse,
    operation_id='readSensors',
    responses={
        401: {'description': 'Unauthorized'},
        403: {'description': 'Forbidden'},
        404: {'description': 'Not found'},
    },
)
def read_sensors():
    return ReadSensorListRequestHandler.handle()[0]


@router.get('/latest', response_model=SensorsLatestValuesResponse, operation_id='readSensorsLatestValues', responses={400: {'description': 'Invalid request'}})
def read_sensors_latest_values():
    return ReadSensorsLatestValuesRequestHandler.handle()[0]


@router.get(
    '/project/{project}/sensor/{sensor}/parameter/{parameter}',
    response_model=SensorDataResponse,
    operation_id='readSensorData',
    responses={400: {'description': 'Invalid request'}},
)
def read_sensor_data(project: str, sensor: str, parameter: str, request: Annotated[ReadSensorDataRequest, Depends()]):
    try:
        return ReadSensorDataRequestHandler.handle(request, project, sensor, parameter)
    except (InvalidDateFormatException, InvalidTimeResolutionException, SensorNotFoundException) as exception:
        return JSONResponse({'error': str(exception)}, status_code=400)
