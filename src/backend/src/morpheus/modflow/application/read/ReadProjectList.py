import dataclasses
from ...infrastructure.persistence.ProjectRepository import ProjectRepository


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
        projects_metadata = ProjectRepository().get_projects_metadata()
        result = []
        for project_id, metadata in projects_metadata.items():
            result.append({
                'project_id': project_id.to_str(),
                'name': metadata.name,
                'description': metadata.description
            })

        return ReadModflowModelListQueryResult(data=result)
