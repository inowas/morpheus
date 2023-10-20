from flask import Blueprint, request

from .presentation.api import ReadSensorListRequestHandler, ReadSensorsLatestValuesRequestHandler, \
    ReadSensorDataRequestHandler


def register_routes(blueprint: Blueprint):
    @blueprint.route('/', methods=['GET'])
    def read_sensors():
        return ReadSensorListRequestHandler.handle(request)

    @blueprint.route('/latest', methods=['GET'])
    def read_sensors_latest_values():
        return ReadSensorsLatestValuesRequestHandler.handle(request)

    @blueprint.route('/project/<project>/sensor/<sensor>/parameter/<parameter>', methods=['GET'])
    def read_sensor_data(project, sensor, parameter):
        return ReadSensorDataRequestHandler.handle(request, project, sensor, parameter)
