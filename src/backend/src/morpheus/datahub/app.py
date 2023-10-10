import click
from flask import Flask, Blueprint, request

from morpheus.authentication.auth import check_token
from morpheus.datahub.presentation.api.sensors import ReadSensorListWithLatestValuesRequestHandler
from morpheus.datahub.presentation.cli.sensors import ReadUITSensorDataFromCSVFilesCliCommand


def bootstrap(app: Flask):
    sensors_blueprint = Blueprint('sensors', __name__)

    @sensors_blueprint.route('/latest', methods=['GET'])
    def read_sensors():
        bearer = request.headers.get('Authorization')
        token = bearer.split(' ')[1]
        return check_token(token)
        # request_handler = ReadSensorListWithLatestValuesRequestHandler()
        # return request_handler.handle()

    @sensors_blueprint.cli.command('read_uit_sensor_data_from_csv_files')
    @click.argument('src_path', type=str)
    @click.argument('target_path_success', type=str)
    @click.argument('target_path_error', type=str)
    def read_uit_sensor_data_from_csv_files(src_path: str, target_path_success: str, target_path_error: str):
        cli_command = ReadUITSensorDataFromCSVFilesCliCommand()
        cli_command.run(src_path, target_path_success, target_path_error)

    @sensors_blueprint.cli.command('test')
    @click.argument('test_string', type=str)
    def test(test_string: str):
        print('Running test command')
        print(test_string)

    app.register_blueprint(sensors_blueprint, url_prefix='/sensors', cli_group='sensors')
