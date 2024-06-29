from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.project.types.Permissions import Role, Permissions
from morpheus.project.types.Project import ProjectSummary
from morpheus.common.types.identity.Identity import Identity
from morpheus.project.types.permissions.Privilege import Privilege
from morpheus.project.types.permissions.UserRoleAssignmentCollection import UserRoleAssignmentCollection


class PermissionService:
    PUBLIC_PROJECT_PRIVILEGES: list[Privilege] = [Privilege.VIEW_PROJECT]
    SUPER_ADMIN_PROJECT_PRIVILEGES: list[Privilege] = [Privilege.FULL_ACCESS]
    OWNER_PROJECT_PRIVILEGES: list[Privilege] = [Privilege.FULL_ACCESS]

    PRIVILEGE_ROLE_MAP: dict[Privilege, list[Role]] = {
        Privilege.VIEW_PROJECT: [Role.VIEWER, Role.EDITOR, Role.ADMIN, Role.OWNER],
        Privilege.EDIT_PROJECT: [Role.EDITOR, Role.ADMIN, Role.OWNER],
        Privilege.MANAGE_PROJECT: [Role.ADMIN, Role.OWNER],
    }

    # will be calculated on first access
    ROLE_PRIVILEGE_MAP: dict[Role, list[Privilege]] = {}

    @staticmethod
    def _calculate_role_privilege_map():
        for privilege, roles in PermissionService.PRIVILEGE_ROLE_MAP.items():
            for role in roles:
                if role not in PermissionService.ROLE_PRIVILEGE_MAP:
                    PermissionService.ROLE_PRIVILEGE_MAP[role] = []
                PermissionService.ROLE_PRIVILEGE_MAP[role].append(privilege)

    @staticmethod
    def _get_privileges_for_role(role: Role) -> list[Privilege]:
        if not PermissionService.ROLE_PRIVILEGE_MAP:
            PermissionService._calculate_role_privilege_map()

        return PermissionService.ROLE_PRIVILEGE_MAP.get(role, [])

    @staticmethod
    def get_roles_required_to(privilege: Privilege) -> list[Role]:
        required_roles = PermissionService.PRIVILEGE_ROLE_MAP.get(privilege, None)
        # we are restrictive here, in case we forget to add a privilege to the map
        if required_roles is None:
            raise InsufficientPermissionsException(f'Privilege "{privilege.value}" is not granted to any role')

        return required_roles

    @staticmethod
    def get_privileges_for_admin_user() -> list[Privilege]:
        return PermissionService.SUPER_ADMIN_PROJECT_PRIVILEGES

    @staticmethod
    def get_privileges_for_owner() -> list[Privilege]:
        return PermissionService.OWNER_PROJECT_PRIVILEGES

    @staticmethod
    def get_privileges_for_identity_by_role_assignment_and_summary(identity: Identity, role_assignments: UserRoleAssignmentCollection, project_summary: ProjectSummary) -> list[Privilege]:
        if identity.is_admin:
            return PermissionService.get_privileges_for_admin_user()

        if project_summary.owner_id == identity.user_id:
            return PermissionService.get_privileges_for_owner()

        role_assignment = role_assignments.role_assignments.get(project_summary.project_id)
        if role_assignment is None:
            return PermissionService.PUBLIC_PROJECT_PRIVILEGES if project_summary.visibility == project_summary.visibility.PUBLIC else []

        return PermissionService._get_privileges_for_role(role_assignment.role)

    @staticmethod
    def get_privileges_for_identity_by_permissions(identity: Identity, permissions: Permissions) -> list[Privilege]:
        if identity.is_admin:
            return PermissionService.get_privileges_for_admin_user()

        if permissions.owner_id == identity.user_id:
            return PermissionService.get_privileges_for_owner()

        member_role = permissions.members.get_member_role(identity.user_id)
        if member_role is None and permissions.visibility == permissions.visibility.PUBLIC:
            return PermissionService.PUBLIC_PROJECT_PRIVILEGES
        if member_role is None:
            return []

        return PermissionService._get_privileges_for_role(member_role)

    @staticmethod
    def identity_can(privilege: Privilege, identity: Identity, permissions: Permissions) -> bool:
        if identity.is_admin or permissions.owner_id == identity.user_id:
            return True

        if permissions.visibility == permissions.visibility.PUBLIC and privilege in PermissionService.PUBLIC_PROJECT_PRIVILEGES:
            return True

        required_roles = PermissionService.PRIVILEGE_ROLE_MAP.get(privilege, None)
        # we are restrictive here, in case we forget to add a privilege to the map
        # and for privileges only granted to superadmins and owners
        if required_roles is None:
            return False

        member_role = permissions.members.get_member_role(identity.user_id)
        if member_role is None:
            return False

        return member_role in required_roles
