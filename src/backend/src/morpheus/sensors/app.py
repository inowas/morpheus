from flask import Flask, Blueprint, request

from .incoming import require_datahub_user
from .presentation.api import ReadSensorListRequestHandler, ReadSensorsLatestValuesRequestHandler, \
    ReadSensorDataRequestHandler
from .presentation.cli import read_uit_sensor_data_from_csv_files_cli_command


def bootstrap(app: Flask):
    sensors_blueprint = Blueprint('sensors', __name__)

    @sensors_blueprint.route('/', methods=['GET'])
    def read_sensors():
        return ReadSensorListRequestHandler.handle(request)

    @sensors_blueprint.route('/latest', methods=['GET'])
    def read_sensors_latest_values():
        return ReadSensorsLatestValuesRequestHandler.handle(request)

    @sensors_blueprint.route('/project/<project>/sensor/<sensor>/parameter/<parameter>')
    def read_sensor_data(project, sensor, parameter):
        return ReadSensorDataRequestHandler.handle(request, project, sensor, parameter)

    @sensors_blueprint.cli.command('sync-uit-sensors')
    def read_uit_sensor_data_from_csv_files():
        read_uit_sensor_data_from_csv_files_cli_command()

    app.register_blueprint(sensors_blueprint, url_prefix='/sensors', cli_group='sensors')
