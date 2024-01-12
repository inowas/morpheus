import dataclasses
from ...infrastructure.persistence.ProjectRepository import project_repository


@dataclasses.dataclass(frozen=True)
class ReadModflowModelListQuery:
    pass


@dataclasses.dataclass(frozen=True)
class ReadModflowModelListQueryResult:
    data: list[dict]

    def to_dict(self) -> list[dict]:
        return self.data


class ReadModflowModelListQueryHandler:
    @staticmethod
    def handle(query: ReadModflowModelListQuery) -> ReadModflowModelListQueryResult:
        projects = project_repository.get_project_list()
        if projects is None:
            return ReadModflowModelListQueryResult([])

        return ReadModflowModelListQueryResult([project.to_dict() for project in projects])
