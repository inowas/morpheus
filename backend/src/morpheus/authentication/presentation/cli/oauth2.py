from morpheus.application.write.command_bus import CommandBus
from morpheus.application.write.oauth2 import CreatePublicClientCommand
from morpheus.common.infrastructure.cli.io import write_success


class CreatePublicClientCliCommand:
    def __init__(self, command_bus: CommandBus):
        self._command_bus = command_bus

    def run(self, name: str):
        self._command_bus.execute(CreatePublicClientCommand(name=name))
        write_success(f"Successfully created public client {name}")
