from morpheus.authentication.application.write.oauth2 import CreatePublicClientCommand, CreatePublicClientCommandHandler
from morpheus.authentication.infrastructure.persistence.oauth2 import ClientRepository
from morpheus.common.infrastructure.persistence.postgresql import db


class UnknownCommandError(Exception):
    pass


class CommandBus:
    def execute(self, command):
        if isinstance(command, CreatePublicClientCommand):
            handler = CreatePublicClientCommandHandler(ClientRepository(db.engine))
        else:
            raise UnknownCommandError(f"Unknown command {command.__name__}")

        handler.handle(command)


authentication_command_bus = CommandBus()
