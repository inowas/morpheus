import uuid
from morpheus.authentication.application.write.command_bus import CommandBus
from morpheus.authentication.application.write.oauth2 import CreatePublicClientCommand
from morpheus.authentication.types.oauth2 import ClientId
from morpheus.common.infrastructure.cli.io import write_success


class CreatePublicClientCliCommand:
    def __init__(self, command_bus: CommandBus):
        self._command_bus = command_bus

    def run(self):
        client_id = ClientId(uuid.uuid4())
        self._command_bus.execute(CreatePublicClientCommand(client_id=client_id, name="public"))
        write_success(f"Successfully created public client with client_id {client_id}")
