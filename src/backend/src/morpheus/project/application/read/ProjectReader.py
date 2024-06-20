from morpheus.common.types.Exceptions import NotFoundException
from ...domain.PermissionService import PermissionService
from ...infrastructure.persistence.UserRoleAssignmentRepository import UserRoleAssignmentRepository, user_role_assignment_repository
from ...infrastructure.persistence.ProjectSummaryRepository import project_summary_repository, ProjectSummaryRepository
from ...types.Permissions import Role
from ...types.Project import ProjectSummary, ProjectId
from ...types.User import UserId


class ProjectReader:
    def __init__(
        self,
        _project_summary_repository: ProjectSummaryRepository,
        _user_role_assignment_repository: UserRoleAssignmentRepository,
    ):
        self._project_summary_repository = _project_summary_repository
        self._user_role_assignment_repository = _user_role_assignment_repository

    def assert_project_exists(self, project_id: ProjectId) -> None:
        if not self.project_exists(project_id):
            raise NotFoundException(f"Project with id {project_id.to_str()} does not exist")

    def project_exists(self, project_id: ProjectId) -> bool:
        return self._project_summary_repository.exists(project_id)

    def get_project_summaries_with_role_for_admin_user(self) -> list[tuple[ProjectSummary, Role]]:
        return [(project_summary, Role.OWNER) for project_summary in self._project_summary_repository.find_all()]

    def get_project_summaries_with_role_for_user(self, user_id: UserId) -> list[tuple[ProjectSummary, Role | None]]:
        role_assignments = self._user_role_assignment_repository.find_role_assignments_for_user_having_roles(
            user_id,
            PermissionService.get_roles_required_to_view_project(),
        )

        project_summaries = self._project_summary_repository.find_all_public_or_owned_by_user_or_by_project_id(user_id, role_assignments.get_all_project_ids())

        return [(project_summary, PermissionService.get_user_role_for_project(user_id, role_assignments, project_summary)) for project_summary in project_summaries]


project_reader = ProjectReader(project_summary_repository, user_role_assignment_repository)
