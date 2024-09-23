from morpheus.common.types.Exceptions import NotFoundException
from morpheus.common.types.identity.Identity import Identity
from ...domain.PermissionService import PermissionService
from ...infrastructure.persistence.UserRoleAssignmentRepository import UserRoleAssignmentRepository, user_role_assignment_repository
from ...infrastructure.persistence.ProjectSummaryRepository import project_summary_repository, ProjectSummaryRepository
from ...types.Project import ProjectSummary, ProjectId, Metadata
from ...types.permissions.Privilege import Privilege


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

    def get_project_summaries_with_user_privileges_for_identity(self, identity: Identity) -> list[tuple[ProjectSummary, list[Privilege]]]:
        if identity.is_admin:
            return [(project_summary, PermissionService.get_privileges_for_admin_user()) for project_summary in self._project_summary_repository.find_all()]

        role_assignments = self._user_role_assignment_repository.find_role_assignments_for_user_having_roles(
            identity.user_id,
            PermissionService.get_roles_required_to(Privilege.VIEW_PROJECT),
        )

        project_summaries = self._project_summary_repository.find_all_public_or_owned_by_user_or_by_project_id(identity.user_id, role_assignments.get_all_project_ids())
        return [(project_summary, PermissionService.get_privileges_for_identity_by_role_assignment_and_summary(identity, role_assignments, project_summary)) for project_summary in project_summaries]

    def get_metadata(self, project_id: ProjectId) -> Metadata:
        metadata = self._project_summary_repository.get_metadata(project_id)
        if metadata is None:
            raise NotFoundException(f"Project with id {project_id.to_str()} does not exist")

        return metadata


project_reader = ProjectReader(project_summary_repository, user_role_assignment_repository)


def get_project_reader() -> ProjectReader:
    return project_reader
