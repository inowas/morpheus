import dataclasses

from morpheus.authentication.infrastructure.password import hash_password, password_strength
from morpheus.user.infrastructure.persistence.user import UserRepository
from morpheus.user.types.user import User


class CreateUserFailed(Exception):
    PASSWORD_STRENGTH_INSUFFICIENT = "PASSWORD_STRENGTH_INSUFFICIENT"
    EMAIL_EXISTS = "EMAIL_EXISTS"

    def __init__(self, error_code: str, *args: object) -> None:
        super().__init__(*args)
        self._error_code = error_code

    def get_error_code(self) -> str:
        return self._error_code


@dataclasses.dataclass(frozen=True)
class CreateUserCommand:
    email: str
    password: str

    def __post_init__(self):
        if len(self.email) <= 0:
            raise ValueError('User email must not be empty')
        if len(self.password) <= 0:
            raise ValueError('User password_hash must not be empty')


class CreateUserCommandHandler:
    def __init__(self, repository: UserRepository) -> None:
        self._repository = repository

    def handle(self, command: CreateUserCommand):
        if self._repository.user_with_email_exists(command.email):
            raise CreateUserFailed(CreateUserFailed.EMAIL_EXISTS)

        if not password_strength(command.password).is_sufficient():
            raise CreateUserFailed(CreateUserFailed.PASSWORD_STRENGTH_INSUFFICIENT)

        user = User.new(command.email, hash_password(command.password))
        self._repository.insert(user)
