from flask import Request, abort, Response

from ....application.write import project_command_bus
from ....application.write.CommandFactory import CommandFactory
from ....application.write.Model import CreateModelCommand, CreateVersionCommand, CreateLayerCommand
from ....application.write.Project import CreateProjectCommand
from ....incoming import get_logged_in_user_id
from ....types.User import UserId


class MessageBoxRequestHandler:
    @staticmethod
    def handle(request: Request):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id_str = get_logged_in_user_id()
        if user_id_str is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(user_id_str)

        # for the sake of simplicity, we make the mapping between the request path and the command explicit here

        body = request.json
        if body is None:
            abort(400, 'Missing body')

        try:
            command_factory = CommandFactory(user_id=user_id)
            command = command_factory.create_from_request_body(body)  # type: ignore
        except ValueError as e:
            abort(400, str(e))

        try:
            project_command_bus.dispatch(command)

            if isinstance(command, CreateProjectCommand):
                return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}'})

            if isinstance(command, CreateModelCommand):
                return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model'})

            if isinstance(command, CreateVersionCommand):
                return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/versions/{command.version_tag.to_str()}'})

            if isinstance(command, CreateLayerCommand):
                return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/layers/{command.layer_id.to_str()}'})

            return Response(status=204)

        except Exception as e:
            abort(500, str(e))
