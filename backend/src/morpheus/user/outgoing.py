import dataclasses
import uuid

from morpheus.user.application.read.query_bus import user_query_bus
from morpheus.user.application.read.user import ReadUserQuery
from morpheus.user.types.user import UserId


@dataclasses.dataclass
class User:
    id: uuid.UUID
    email: str
    password_hash: str


def fetch_user_by_email(email: str) -> User | None:
    user = user_query_bus.execute(ReadUserQuery(email=email))
    if user is None:
        return None

    return User(id=user.id, email=user.email, password_hash=user.password_hash)


def fetch_user_by_id(id: uuid.UUID) -> User | None:
    user = user_query_bus.execute(ReadUserQuery(id=UserId(id)))
    if user is None:
        return None

    return User(id=user.id, email=user.email, password_hash=user.password_hash)
