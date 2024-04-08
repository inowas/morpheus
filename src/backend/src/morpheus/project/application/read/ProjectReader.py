from morpheus.common.types.Exceptions import NotFoundException
from ...infrastructure.persistence.ProjectSummaryRepository import project_summary_repository, ProjectSummaryRepository
from ...types.Project import ProjectSummary, ProjectId


class ProjectReader:
    def __init__(
        self,
        _project_summary_repository: ProjectSummaryRepository,
    ):
        self._project_summary_repository = _project_summary_repository

    def assert_project_exists(self, project_id: ProjectId) -> None:
        if not self.project_exists(project_id):
            raise NotFoundException(f"Project with id {project_id.to_str()} does not exist")

    def project_exists(self, project_id: ProjectId) -> bool:
        return self._project_summary_repository.exists(project_id)

    def get_project_summaries(self) -> list[ProjectSummary]:
        return self._project_summary_repository.find_all()


project_reader = ProjectReader(project_summary_repository)
