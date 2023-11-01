from flask import Request, abort, jsonify

from ....application.write.CreateModflowModel import CreateModflowModelCommand, CreateModflowModelCommandHandler
from ....types.Metadata import UserId, Description, Tags, Name
from ....types.SpatialDiscretization import Polygon, LengthUnit, Rotation, CRS, Grid
from .messages import CreateModflowModelMessage


class MessageBoxRequestHandler:
    @staticmethod
    def handle(request: Request):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        try:
            message_name = request.json.get('message_name')
        except KeyError as e:
            abort(400, f'Missing required key in request body: {e}')

        match message_name:
            case 'create_modflow_model':
                message = CreateModflowModelMessage.from_dict(request.json)
                payload = message.payload
                user_id = 'user_id'

                command = CreateModflowModelCommand(
                    name=Name.from_str(payload.get('name')),
                    description=Description.from_str(payload.get('description')),
                    tags=Tags.from_list(payload.get('tags')),
                    geometry=Polygon.from_dict({
                        'type': payload.get('geometry').get('type'),
                        'coordinates': payload.get('geometry').get('coordinates')
                    }),
                    grid=Grid.from_dict({
                        'rows': payload.get('grid').get('rows'),
                        'columns': payload.get('grid').get('columns')
                    }),
                    length_unit=LengthUnit.from_str(payload.get('length_unit')),
                    rotation=Rotation.from_float(payload.get('rotation')),
                    crs=CRS.from_str(payload.get('crs')),
                    user_id=UserId.from_str(user_id)
                )

                result = CreateModflowModelCommandHandler.handle(command=command)
                response = jsonify()
                response.status_code = 201
                response.headers['location'] = 'modflow/' + result.id

                return response

            case _:
                abort(400, f'Unknown message name: {message_name}')
