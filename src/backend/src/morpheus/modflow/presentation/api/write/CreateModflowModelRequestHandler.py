import uuid
from typing import TypedDict
from flask import Request, abort, jsonify

from ....application.write.CreateModflowModel import CreateModflowModelCommand, CreateModflowModelCommandHandler, \
    CreateGridDict
from ....types.Metadata import UserId, Description, Tags, Name
from ....types.SpatialDiscretization import Polygon


class PolygonDict(TypedDict):
    type: str
    coordinates: list[list[list[float, float]]]


class CreateModflowModelRequest(TypedDict, total=True):
    name: str
    description: str
    tags: list[str]
    geometry: PolygonDict
    grid_properties: CreateGridDict


class CreateModflowModelRequestHandler:
    @staticmethod
    def handle(request: Request):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        create_modflow_model_request = CreateModflowModelRequest(**request.json)

        name = Name.from_str(create_modflow_model_request.get('name'))
        description = Description.from_str(create_modflow_model_request.get('description'))
        tags = Tags.from_list(create_modflow_model_request.get('tags', []))
        geometry = Polygon.from_dict(create_modflow_model_request.get('geometry'))
        grid_properties = create_modflow_model_request.get('grid_properties')
        user_id = UserId.from_str(str(uuid.uuid4()))

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
