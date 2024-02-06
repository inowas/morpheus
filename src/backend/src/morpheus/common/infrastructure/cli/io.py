import click


def write_header(message: str):
    click.secho(message, bold=True)
    click.secho('-' * len(message), bold=True)
    click.secho('')


def write_info(message: str):
    click.secho(message)


def write_error(message: str):
    click.secho(message, fg='red')


def write_success(message: str):
    click.secho(message, fg='green')
