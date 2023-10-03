import click


def write_error(message: str):
    click.secho(message, fg='red')


def write_success(message: str):
    click.secho(message, fg='green')
