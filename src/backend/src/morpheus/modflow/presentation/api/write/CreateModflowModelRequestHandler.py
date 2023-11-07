import dataclasses
from typing import TypedDict
from flask import Request, abort, jsonify

from ....application.write.CreateModflowModel import CreateModflowModelCommand, CreateModflowModelCommandHandler, \
    CreateGridDict
from ....incoming import get_logged_in_user_id
from ....types.Metadata import Description, Tags, Name
from ....types.SpatialDiscretization import Polygon
from ....types.User import UserId


class PolygonDict(TypedDict, total=True):
    type: str
    coordinates: list[list[list[float]]]


@dataclasses.dataclass
class CreateModflowModelRequest:
    name: str
    description: str
    tags: list[str]
    geometry: PolygonDict
    grid_properties: CreateGridDict

    @classmethod
    def from_dict(cls, obj):
        return cls(
            name=obj['name'],
            description=obj['description'],
            tags=obj['tags'],
            geometry=obj['geometry'],
            grid_properties=obj['grid_properties']
        )


class CreateModflowModelRequestHandler:
    @staticmethod
    def handle(request: Request):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        create_modflow_model_request = CreateModflowModelRequest.from_dict(obj=request.json)
        name = Name.from_str(create_modflow_model_request.name)
        description = Description.from_str(create_modflow_model_request.description)
        tags = Tags.from_list(create_modflow_model_request.tags)
        geometry = Polygon.from_dict(create_modflow_model_request.geometry.__dict__)
        grid_properties = create_modflow_model_request.grid_properties
        user_id = UserId.from_value(user_id)

        command = CreateModflowModelCommand(
            name=name,
            description=description,
            tags=tags,
            geometry=geometry,
            grid_properties=grid_properties,
            user_id=user_id
        )

        result = CreateModflowModelCommandHandler.handle(command=command)
        response = jsonify()
        response.status_code = 201
        response.headers['location'] = 'modflow/' + result.id

        return response
