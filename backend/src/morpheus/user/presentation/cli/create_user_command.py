from morpheus.authentication.infrastructure.password import Password
from morpheus.common.presentation.cli.command import CliCommand, CommandResult
from morpheus.user.infrastructure.persistence.user_repository import UserRepository
from morpheus.user.types.user import User


class CreateUserCommand(CliCommand):
    def __init__(self, repository: UserRepository, email: str, password: str):
        self.repository = repository
        self.email = email
        self.password = password

    def execute(self) -> CommandResult:
        if Password.strength(self.password).is_sufficient() is False:
            return CommandResult.failure(1)

        self.repository.insert(User.new(self.email, Password.hash(self.password)))
        return CommandResult.success()

