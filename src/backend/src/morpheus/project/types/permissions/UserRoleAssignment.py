import dataclasses

from morpheus.project.types.Permissions import Role
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId


@dataclasses.dataclass(frozen=True)
class UserRoleAssignment:
    project_id: ProjectId
    user_id: UserId
    role: Role
