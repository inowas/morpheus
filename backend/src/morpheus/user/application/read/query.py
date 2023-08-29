from abc import ABC, abstractmethod
from typing import TypeVar, Generic

QueryResult = TypeVar('QueryResult')


class Query(Generic[QueryResult]):
    pass


class QueryHandler(ABC, Generic[QueryResult]):
    @abstractmethod
    def handle(self, query: Query) -> QueryResult:
        pass
