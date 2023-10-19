from flask import Flask, Blueprint, request

from .presentation.api import ReadSensorListRequestHandler, ReadSensorsLatestValuesRequestHandler, \
    ReadSensorDataRequestHandler
from .presentation.cli import read_uit_sensor_data_from_csv_files_cli_command


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
