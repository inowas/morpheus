import dataclasses
from flask import Request, abort

from ....application.write.UpdateMetadata import UpdateMetadataCommand, \
    UpdateMetadataCommandHandler
from ....incoming import get_logged_in_user_id
from ....types.Metadata import Description, Tags, Name
from ....types.Project import ProjectId


@dataclasses.dataclass
class UpdateMetadataRequest:
    name: str | None
    description: str | None
    tags: list[str] | None

    @classmethod
    def from_dict(cls, obj):
        return cls(
            name=obj['name'] if 'name' in obj else None,
            description=obj['description'] if 'description' in obj else None,
            tags=obj['tags'] if 'tags' in obj else None,
        )


class UpdateMetadataRequestHandler:
    @staticmethod
    def handle(request: Request, project_id: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id)

        update_modflow_model_metadata = UpdateMetadataRequest.from_dict(obj=request.json)

        name = update_modflow_model_metadata.name
        if name is not None:
            name = Name.from_str(update_modflow_model_metadata.name)

        description = update_modflow_model_metadata.description
        if description is not None:
            description = Description.from_str(update_modflow_model_metadata.description)

        tags = update_modflow_model_metadata.tags
        if tags is not None:
            tags = Tags.from_list(update_modflow_model_metadata.tags)

        command = UpdateMetadataCommand(
            project_id=project_id,
            name=name,
            description=description,
            tags=tags,
        )

        UpdateMetadataCommandHandler.handle(command=command)
        return None, 201
