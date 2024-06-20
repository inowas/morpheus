from morpheus.common.types.Exceptions import NotFoundException
from ...infrastructure.persistence.PermissionsRepository import permissions_repository
from ...types.Permissions import Permissions
from ...types.Project import ProjectId


class PermissionsReader:
    def get_permissions(self, project_id: ProjectId) -> Permissions:
        permissions = permissions_repository.get_permissions(project_id)
        if permissions is None:
            raise NotFoundException(f'Could not find permissions for project with id {project_id.to_str()}')

        return permissions


permissions_reader = PermissionsReader()
