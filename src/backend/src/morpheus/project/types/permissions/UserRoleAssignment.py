import dataclasses

from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.Permissions import Role
from morpheus.project.types.Project import ProjectId


@dataclasses.dataclass(frozen=True)
class UserRoleAssignment:
    project_id: ProjectId
    user_id: UserId
    role: Role
