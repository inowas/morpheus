from flask import Blueprint

from .presentation.cli import read_uit_sensor_data_from_csv_files_cli_command


def register_cli_commands(blueprint: Blueprint):
    @blueprint.cli.command('sync-uit-sensors')
    def read_uit_sensor_data_from_csv_files():
        read_uit_sensor_data_from_csv_files_cli_command()
