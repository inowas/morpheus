from flask import Blueprint


def register_cli_commands(blueprint: Blueprint):
    @blueprint.cli.command('list-models')
    def read_models():
        """List all models"""
        print('list-models')
