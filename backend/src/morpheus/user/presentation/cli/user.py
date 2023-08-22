from morpheus.common.infrastructure.cli.io import write_success, write_error
from morpheus.user.application.create_user import CreateUserCommandHandler, CreateUserFailed, CreateUserCommand


class CreateUserCliCommand:
    def __init__(self, command_handler: CreateUserCommandHandler):
        self._command_handler = command_handler

    def run(self, email: str, password: str):
        def get_reason_for_failure(failure: CreateUserFailed) -> str:
            if failure.get_error_code() == CreateUserFailed.EMAIL_EMPTY:
                return 'Email is empty'
            elif failure.get_error_code() == CreateUserFailed.PASSWORD_EMPTY:
                return 'Password is empty'
            elif failure.get_error_code() == CreateUserFailed.PASSWORD_STRENGTH_INSUFFICIENT:
                return 'Password strength is insufficient'
            elif failure.get_error_code() == CreateUserFailed.EMAIL_EXISTS:
                return 'Email already exists'
            else:
                return 'Unknown reason'

        try:
            self._command_handler.handle(CreateUserCommand(email=email, password=password))
            write_success(f"Successfully created user {email}")
        except CreateUserFailed as exception:
            write_error(f"Could not create user {email}. Reason: {get_reason_for_failure(exception)}")
