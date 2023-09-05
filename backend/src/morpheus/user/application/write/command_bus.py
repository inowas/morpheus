from morpheus.common.infrastructure.persistence.postgresql import db
from morpheus.user.application.write.user import CreateUserCommand, CreateUserCommandHandler
from morpheus.user.infrastructure.persistence.user import UserRepository


class UnknownCommandError(Exception):
    pass


class CommandBus:
    def execute(self, command):
        if isinstance(command, CreateUserCommand):
            handler = CreateUserCommandHandler(UserRepository(db.engine))
        else:
            raise UnknownCommandError(f"Unknown command {command.__name__}")

        handler.handle(command)


user_command_bus = CommandBus()
