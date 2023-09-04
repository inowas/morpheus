from morpheus.common.infrastructure.persistence.database import db
from morpheus.user.application.read.query import Query, QueryResult
from morpheus.user.application.read.user import ReadUserQuery, ReadUserQueryHandler, \
    ReadAuthenticatedUserProfileQuery, ReadAuthenticatedUserProfileQueryHandler
from morpheus.user.infrastructure.persistence.user import UserRepository


class UnknownQueryError(Exception):
    pass


class QueryBus:
    def execute(self, query: Query[QueryResult]) -> QueryResult:
        if isinstance(query, ReadUserQuery):
            handler = ReadUserQueryHandler(UserRepository(db.engine))
        elif isinstance(query, ReadAuthenticatedUserProfileQuery):
            handler = ReadAuthenticatedUserProfileQueryHandler(UserRepository(db.engine))
        else:
            raise UnknownQueryError(f"Unknown query {type(query).__name__}")

        return handler.handle(query)  # pyright: ignore


user_query_bus = QueryBus()
