from flask import Blueprint

from morpheus.project.presentation.cli.ProjectionCliCommands import ReprojectPreviewImagesCliCommand, ReprojectProjectSummariesCliCommand


def register_cli_commands(blueprint: Blueprint):
    @blueprint.cli.command('reproject-project-summaries')
    def reproject_project_summaries():
        ReprojectProjectSummariesCliCommand.run()

    @blueprint.cli.command('reproject-preview-images')
    def reproject_preview_images():
        ReprojectPreviewImagesCliCommand.run()
