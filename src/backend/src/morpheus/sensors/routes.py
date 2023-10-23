from flask import Blueprint, request
from flask_cors import CORS, cross_origin

from .presentation.api import ReadSensorListRequestHandler, ReadSensorsLatestValuesRequestHandler, \
    ReadSensorDataRequestHandler


def register_routes(blueprint: Blueprint):
    CORS(blueprint)

    @blueprint.route('', methods=['GET'], strict_slashes=False)
    @cross_origin(origins=['*'], methods=['GET'], allow_headers=['*'])
    def read_sensors():
        return ReadSensorListRequestHandler.handle(request)

    @blueprint.route('/latest', methods=['GET'], strict_slashes=False)
    @cross_origin(origins=['*'], methods=['GET'], allow_headers=['*'])
    def read_sensors_latest_values():
        return ReadSensorsLatestValuesRequestHandler.handle(request)

    @blueprint.route('/project/<project>/sensor/<sensor>/parameter/<parameter>', methods=['GET'], strict_slashes=False)
    @cross_origin(origins=['*'], methods=['GET'], allow_headers=['*'])
    def read_sensor_data(project, sensor, parameter):
        return ReadSensorDataRequestHandler.handle(request, project, sensor, parameter)
