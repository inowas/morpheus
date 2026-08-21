from pydantic import BaseModel, Field

from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException
from morpheus.project.application.read.PermissionsReader import permissions_reader
from morpheus.project.application.read.ProjectReader import get_project_reader
from morpheus.project.incoming import get_identity
from morpheus.project.types.permissions.Privilege import Privilege
from morpheus.project.types.Project import ProjectId


class ProjectMetadataResponse(BaseModel):
    name: str = Field(..., examples=['Example project'])
    description: str = Field(..., examples=['Example description'])
    tags: list[str] = Field(..., examples=[['demo']])


class ReadProjectMetadataRequestHandler:
    def handle(self, project_id: ProjectId) -> tuple[ProjectMetadataResponse | dict | str, int]:
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            project_reader = get_project_reader()
            metadata = project_reader.get_metadata(project_id)
            return ProjectMetadataResponse(**metadata.to_dict()).model_dump(), 200

        except InsufficientPermissionsException as e:
            return str(e), 403

        except NotFoundException:
            return {'message': 'Project not found'}, 404
