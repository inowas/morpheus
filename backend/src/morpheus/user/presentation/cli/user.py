from morpheus.common.infrastructure.cli.io import write_success, write_error
from morpheus.user.application.write.command_bus import CommandBus
from morpheus.user.application.write.user import CreateUserFailed, CreateUserCommand


class CreateUserCliCommand:
    def __init__(self, command_bus: CommandBus):
        self._command_bus = command_bus

    def run(self, email: str, password: str):
        def get_reason_for_failure(failure: CreateUserFailed) -> str:
            if failure.get_error_code() == CreateUserFailed.PASSWORD_STRENGTH_INSUFFICIENT:
                return 'Password strength is insufficient'
            elif failure.get_error_code() == CreateUserFailed.EMAIL_EXISTS:
                return 'Email already exists'
            else:
                return 'Unknown reason'

        try:
            self._command_bus.execute(CreateUserCommand(email=email, password=password))
            write_success(f"Successfully created user {email}")
        except CreateUserFailed as exception:
            write_error(f"Could not create user {email}. Reason: {get_reason_for_failure(exception)}")
