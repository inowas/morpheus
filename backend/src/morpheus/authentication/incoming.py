import morpheus.user.outgoing as from_user_module
from morpheus.authentication.types.oauth2 import User, UserId


def fetch_user_by_email(email: str) -> User | None:
    user = from_user_module.fetch_user_by_email(email)
    if user is None:
        return None

    return User(id=UserId(user.id), email=user.email, password_hash=user.password_hash)


def fetch_user_by_id(id: UserId) -> User | None:
    user = from_user_module.fetch_user_by_id(id)
    if user is None:
        return None

    return User(id=UserId(user.id), email=user.email, password_hash=user.password_hash)
