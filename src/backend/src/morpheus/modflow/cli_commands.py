from flask import Blueprint

from morpheus.modflow.presentation.cli.ProjectionCliCommands import ReprojectProjectSummariesCliCommand


def register_cli_commands(blueprint: Blueprint):
    @blueprint.cli.command('list-models')
    def read_models():
        """List all models"""
        print('list-models')

    @blueprint.cli.command('reproject-project-summaries')
    def reproject_project_summaries():
        """Reproject project summaries"""
        ReprojectProjectSummariesCliCommand.run()
