import dataclasses
from typing import TypedDict
from flask import Request, abort, jsonify

from ....application.write.CreateBaseModel import CreateBaseModelCommand, CreateBaseModelCommandHandler, \
    CreateGridDict
from ....incoming import get_logged_in_user_id
from morpheus.modflow.types.discretization.spatial.SpatialDiscretization import Polygon
from ....types.Project import ProjectId
from ....types.User import UserId


class PolygonDict(TypedDict, total=True):
    type: str
    coordinates: list[list[list[float]]]


@dataclasses.dataclass
class CreateBaseModelRequest:
    geometry: PolygonDict
    grid_properties: CreateGridDict

    @classmethod
    def from_dict(cls, obj):
        return cls(
            geometry=obj['geometry'],
            grid_properties=obj['grid_properties']
        )


class CreateBaseModelRequestHandler:
    @staticmethod
    def handle(request: Request, project_id: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        project_id = ProjectId.from_str(project_id)
        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        create_modflow_model_request = CreateBaseModelRequest.from_dict(obj=request.json)
        geometry = Polygon.from_dict(create_modflow_model_request.geometry.__dict__)
        grid_properties = create_modflow_model_request.grid_properties
        user_id = UserId.from_value(user_id)

        command = CreateBaseModelCommand(
            project_id=project_id,
            geometry=geometry,
            grid_properties=grid_properties,
            user_id=user_id
        )

        result = CreateBaseModelCommandHandler.handle(command=command)
        response = jsonify()
        response.status_code = 201
        response.headers['location'] = 'modflow/' + result.model_id.to_str()

        return response
