from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException
from morpheus.common.types.identity.Identity import Identity

from ...domain.PermissionService import PermissionService
from ...infrastructure.persistence.PermissionsRepository import permissions_repository
from ...types.Permissions import Permissions
from ...types.permissions.Privilege import Privilege
from ...types.Project import ProjectId


class PermissionsReader:
    def get_permissions(self, project_id: ProjectId) -> Permissions:
        permissions = permissions_repository.get_permissions(project_id)
        if permissions is None:
            raise NotFoundException(f'Could not find permissions for project with id {project_id.to_str()}')

        return permissions

    def assert_identity_can(self, privilege: Privilege, identity: Identity, project_id: ProjectId):
        permissions = self.get_permissions(project_id)

        if not PermissionService.identity_can(privilege, identity, permissions):
            raise InsufficientPermissionsException(f'User "{identity.user_id.to_str()}" does not have privilege "{privilege.value}" on project "{project_id.to_str()}"')

    def get_privileges_for_identity(self, identity: Identity, project_id: ProjectId) -> list[Privilege]:
        return PermissionService.get_privileges_for_identity_by_permissions(identity=identity, permissions=self.get_permissions(project_id))


permissions_reader = PermissionsReader()
