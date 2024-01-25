import dataclasses
from ...infrastructure.persistence.ProjectSummaryProjection import project_summary_projection


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
        project_summaries = project_summary_projection.find_all()
        result = []
        for project_summary in project_summaries:
            result.append({
                'project_id': project_summary.project_id.to_str(),
                'name': project_summary.project_name.to_str(),
                'description': project_summary.project_description.to_str(),
                'tags': project_summary.project_tags.to_list(),
                'owner_id': project_summary.owner_id.to_str(),
            })

        return ReadModflowModelListQueryResult(data=result)
