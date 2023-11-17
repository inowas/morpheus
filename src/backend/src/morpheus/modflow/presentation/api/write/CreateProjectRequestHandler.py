import dataclasses
from typing import TypedDict
from flask import Request, abort, jsonify

from ....application.write.CreateProject import CreateProjectCommand, CreateProjectCommandHandler
from ....incoming import get_logged_in_user_id
from ....types.Metadata import Description, Tags, Name
from ....types.User import UserId


class PolygonDict(TypedDict, total=True):
    type: str
    coordinates: list[list[list[float]]]


@dataclasses.dataclass
class CreateProjectRequest:
    name: str
    description: str
    tags: list[str]

    @classmethod
    def from_dict(cls, obj):
        return cls(
            name=obj['name'],
            description=obj['description'],
            tags=obj['tags'],
        )


class CreateProjectRequestHandler:
    @staticmethod
    def handle(request: Request):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        create_modflow_model_request = CreateProjectRequest.from_dict(obj=request.json)
        name = Name.from_str(create_modflow_model_request.name)
        description = Description.from_str(create_modflow_model_request.description)
        tags = Tags.from_list(create_modflow_model_request.tags)
        user_id = UserId.from_value(user_id)

        command = CreateProjectCommand(
            name=name,
            description=description,
            tags=tags,
            user_id=user_id
        )

        result = CreateProjectCommandHandler.handle(command=command)
        response = jsonify()
        response.status_code = 201
        response.headers['location'] = 'modflow/' + result.model_id.to_str()

        return response
