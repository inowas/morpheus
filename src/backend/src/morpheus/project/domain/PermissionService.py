from morpheus.project.types.Permissions import Role, Permissions
from morpheus.project.types.Project import ProjectSummary
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.permissions.UserRoleAssignmentCollection import UserRoleAssignmentCollection


class PermissionService:
    @staticmethod
    def get_roles_required_to_view_project() -> list[Role]:
        return [Role.VIEWER, Role.EDITOR, Role.ADMIN, Role.OWNER]

    @staticmethod
    def get_user_role_for_project(user_id: UserId, role_assignments: UserRoleAssignmentCollection, project_summary: ProjectSummary) -> Role | None:
        if project_summary.owner_id == user_id:
            return Role.OWNER

        role_assignment = role_assignments.role_assignments.get(project_summary.project_id)
        if role_assignment is None:
            return None

        return role_assignment.role

    @staticmethod
    def user_can_view_event_log(user_id: UserId, permissions: Permissions) -> bool:
        return permissions.member_can_view(user_id)
