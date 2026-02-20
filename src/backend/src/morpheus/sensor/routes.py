from flask import Blueprint, request
from flask_cors import CORS, cross_origin

from ..common.presentation.api.middleware.schema_validation import validate_request
from .presentation.api import ReadSensorDataRequestHandler, ReadSensorListRequestHandler, ReadSensorsLatestValuesRequestHandler


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)

    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    @validate_request
    def read_sensors():
        return ReadSensorListRequestHandler.handle(request)

    @blueprint.route('/latest', methods=['GET'])
    @cross_origin()
    @validate_request
    def read_sensors_latest_values():
        return ReadSensorsLatestValuesRequestHandler.handle(request)

    @blueprint.route('/project/<project>/sensor/<sensor>/parameter/<parameter>', methods=['GET'])
    @cross_origin()
    def read_sensor_data(project, sensor, parameter):
        return ReadSensorDataRequestHandler.handle(request, project, sensor, parameter)
