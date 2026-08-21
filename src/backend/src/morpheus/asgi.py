import json
import os
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse, PlainTextResponse

from morpheus.sensor.application.read.ReadSensorData import InvalidDateFormatException, InvalidTimeResolutionException, SensorNotFoundException
from morpheus.sensor.presentation.api import ReadSensorListRequestHandler, ReadSensorsLatestValuesRequestHandler
from morpheus.sensor.presentation.api.ReadSensorDataRequestHandler import ReadSensorDataRequest, ReadSensorDataRequestHandler, SensorDataResponse
from morpheus.sensor.presentation.api.ReadSensorListRequestHandler import SensorListResponse
from morpheus.sensor.presentation.api.ReadSensorsLatestValuesRequestHandler import SensorsLatestValuesResponse
from morpheus.settings import settings

app = FastAPI(docs_url=None, openapi_url=None, redoc_url=None)


@app.get('/healthcheck', response_class=PlainTextResponse)
def healthcheck():
    return 'OK'


@app.get('/schema')
def read_schema():
    if not os.path.exists(settings.OPENAPI_BUNDLED_SPEC_FILE):
        return JSONResponse({'error': 'No schema available, Please run "make build-openapi-spec" first.'}, status_code=404)

    with open(settings.OPENAPI_BUNDLED_SPEC_FILE) as file:
        return json.load(file)


@app.get('/sensors', response_model=SensorListResponse)
def read_sensors():
    return ReadSensorListRequestHandler.handle()[0]


@app.get('/sensors/latest', response_model=SensorsLatestValuesResponse)
def read_sensors_latest_values():
    return ReadSensorsLatestValuesRequestHandler.handle()[0]


@app.get('/sensors/project/{project}/sensor/{sensor}/parameter/{parameter}', response_model=SensorDataResponse)
def read_sensor_data(
    project: str,
    sensor: str,
    parameter: str,
    request: Annotated[ReadSensorDataRequest, Depends()],
):
    try:
        return ReadSensorDataRequestHandler.handle(request, project, sensor, parameter)
    except (InvalidDateFormatException, InvalidTimeResolutionException, SensorNotFoundException) as exception:
        return JSONResponse({'error': str(exception)}, status_code=400)
