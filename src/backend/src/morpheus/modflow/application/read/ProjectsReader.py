from ...infrastructure.persistence.ProjectSummaryRepository import project_summary_repository
from ...types.Project import ProjectSummary


class ProjectsReader:
    def get_project_summaries(self) -> list[ProjectSummary]:
        return project_summary_repository.find_all()
