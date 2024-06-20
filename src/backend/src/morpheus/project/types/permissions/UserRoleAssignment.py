import dataclasses

from morpheus.project.types.Permissions import Role
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId


@dataclasses.dataclass(frozen=True)
class UserRoleAssignment:
    project_id: ProjectId
    user_id: UserId
    role: Role
