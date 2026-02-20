from flask import Request, abort
from sentry_sdk import capture_exception

from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException

from ....application.write import project_command_bus
from ....application.write.CommandFactory import command_factory
from ....incoming import get_identity
from ..helpers.message_box import assert_identity_can_execute_command, generate_response_for


class MessageBoxRequestHandler:
    @staticmethod
    def handle(request: Request):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        identity = get_identity()
        if identity is None:
            abort(401, 'Unauthorized')
        user_id = identity.user_id

        # for the sake of simplicity, we make the mapping between the request path and the command explicit here
        body = request.json
        if body is None:
            abort(400, 'Missing body')

        try:
            command = command_factory.create_from_request_body(user_id=user_id, body=body)  # type: ignore
            assert_identity_can_execute_command(identity, command)
            project_command_bus.dispatch(command)
            return generate_response_for(command)
        except NotFoundException as e:
            abort(404, str(e))
        except InsufficientPermissionsException as e:
            abort(403, str(e))
        except ValueError as e:
            capture_exception(e)
            abort(400, str(e))
        except Exception as e:
            capture_exception(e)
            abort(500, str(e))
