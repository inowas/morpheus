import dataclasses
from flask import Request, abort, jsonify

from ....application.write.UpdateModflowModelMetadata import UpdateModflowModelMetadataCommand, \
    UpdateModflowModelMetadataCommandHandler
from ....incoming import get_logged_in_user_id
from ....types.Metadata import Description, Tags, Name
from ....types.ModflowModel import ModelId


@dataclasses.dataclass
class UpdateModflowModelMetadataRequest:
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


class UpdateModflowModelMetadataRequestHandler:
    @staticmethod
    def handle(request: Request, model_id: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        model_id = ModelId.from_str(model_id)
        update_modflow_model_metadata = UpdateModflowModelMetadataRequest.from_dict(obj=request.json)

        name = update_modflow_model_metadata.name
        if name is not None:
            name = Name.from_str(update_modflow_model_metadata.name)

        description = update_modflow_model_metadata.description
        if description is not None:
            description = Description.from_str(update_modflow_model_metadata.description)

        tags = update_modflow_model_metadata.tags
        if tags is not None:
            tags = Tags.from_list(update_modflow_model_metadata.tags)

        command = UpdateModflowModelMetadataCommand(
            model_id=model_id,
            name=name,
            description=description,
            tags=tags,
        )

        UpdateModflowModelMetadataCommandHandler.handle(command=command)
        return None, 201
