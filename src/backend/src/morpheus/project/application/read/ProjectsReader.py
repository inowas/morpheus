from ...infrastructure.persistence.ProjectSummaryRepository import project_summary_repository
from ...types.Project import ProjectSummary, ProjectId


class ProjectsReader:
    def project_exists(self, project_id: ProjectId) -> bool:
        return project_summary_repository.exists(project_id)

    def get_project_summaries(self) -> list[ProjectSummary]:
        return project_summary_repository.find_all()


projects_reader = ProjectsReader()
