import click
from flask import Flask, Blueprint

from .incoming import require_datahub_user
from .presentation.api import read_sensor_list_with_latest_values_request_handler
from .presentation.cli import read_uit_sensor_data_from_csv_files_cli_command


def bootstrap(app: Flask):
    sensors_blueprint = Blueprint('sensors', __name__)

    @sensors_blueprint.route('/', methods=['GET'])
    def read_sensors():
        return []

    @sensors_blueprint.route('/latest', methods=['GET'])
    def read_sensor_latest_values():
        return read_sensor_list_with_latest_values_request_handler()

    @sensors_blueprint.cli.command('sync-uit-sensors')
    def read_uit_sensor_data_from_csv_files():
        read_uit_sensor_data_from_csv_files_cli_command()

    app.register_blueprint(sensors_blueprint, url_prefix='/sensors', cli_group='sensors')
