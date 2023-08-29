import dataclasses
from morpheus.user.application.read.query import Query, QueryHandler
from morpheus.user.infrastructure.persistence.user import UserRepository
from morpheus.user.types.user import User, UserId


@dataclasses.dataclass(frozen=True)
class ReadUserQuery(Query[User | None]):
    id: UserId | None = None
    email: str | None = None

    def __post_init__(self):
        if self.id is None and self.email is None:
            raise ValueError('Either id or email must be provided for query')
        if self.id is not None and self.email is not None:
            raise ValueError('Only one of id or email must be provided for query')

    @classmethod
    def by_id(cls, id: UserId):
        return cls(id=id)

    @classmethod
    def by_email(cls, email: str):
        return cls(email=email)


class ReadUserQueryHandler(QueryHandler[User | None]):
    def __init__(self, repository: UserRepository) -> None:
        self._repository = repository

    def handle(self, query: ReadUserQuery) -> User | None:
        if query.id is not None:
            return self._repository.fetch_by_id(query.id)
        if query.email is not None:
            return self._repository.fetch_by_email(query.email)
