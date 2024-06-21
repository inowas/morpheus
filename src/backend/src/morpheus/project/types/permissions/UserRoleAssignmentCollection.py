import dataclasses

from morpheus.project.types.Project import ProjectId
from morpheus.project.types.permissions.UserRoleAssignment import UserRoleAssignment
from morpheus.common.types.identity.Identity import UserId


@dataclasses.dataclass()
class UserRoleAssignmentCollection:
    user_id: UserId
    role_assignments: dict[ProjectId, UserRoleAssignment]

    @staticmethod
    def empty(user_id: UserId) -> 'UserRoleAssignmentCollection':
        return UserRoleAssignmentCollection(user_id, {})

    def add_role_assignment(self, role_assignment: UserRoleAssignment):
        if role_assignment.user_id != self.user_id:
            raise ValueError('Cannot add role assignment for different user')
        if role_assignment.project_id in self.role_assignments:
            raise ValueError('Role assignment already exists for project')

        self.role_assignments[role_assignment.project_id] = role_assignment

    def get_role_assignment_for_project(self, project_id: ProjectId) -> UserRoleAssignment:
        return self.role_assignments[project_id]

    def get_all_project_ids(self) -> list[ProjectId]:
        return list(self.role_assignments.keys())
