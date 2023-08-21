from morpheus.authentication.infrastructure.password import hash_password, password_strength
from morpheus.user.infrastructure.persistence.user import UserRepository
from morpheus.user.types.user import User


class CreateUserFailed(Exception):
    EMAIL_EMPTY = "EMAIL_EMPTY"
    PASSWORD_EMPTY = "PASSWORD_EMPTY"
    PASSWORD_STRENGTH_INSUFFICIENT = "PASSWORD_STRENGTH_INSUFFICIENT"
    EMAIL_EXISTS = "EMAIL_EXISTS"

    def __init__(self, error_code: str, *args: object) -> None:
        super().__init__(*args)
        self._error_code = error_code

    def get_error_code(self) -> str:
        return self._error_code


class CreateUserCommandHandler:
    def __init__(self, repository: UserRepository) -> None:
        self._repository = repository

    def handle(self, email: str, password: str):
        if not isinstance(email, str) or len(email) < 1:
            raise CreateUserFailed(CreateUserFailed.EMAIL_EMPTY)

        if not isinstance(password, str) or len(password) < 1:
            raise CreateUserFailed(CreateUserFailed.PASSWORD_EMPTY)

        if self._repository.user_with_email_exists(email):
            raise CreateUserFailed(CreateUserFailed.EMAIL_EXISTS)

        if not password_strength(password).is_sufficient():
            raise CreateUserFailed(CreateUserFailed.PASSWORD_STRENGTH_INSUFFICIENT)

        user = User.new(email, hash_password(password))
        self._repository.insert(user)
