from pydantic import BaseModel
from sentry_sdk import capture_exception

from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException
from morpheus.common.types.HttpResponse import HttpResponse

from ....application.write import project_command_bus
from ....application.write.CommandFactory import command_factory
from ....exceptions.UnauthorizedException import UnauthorizedException
from ....incoming import get_identity
from ..helpers.message_box import assert_identity_can_execute_command, generate_response_for


class MessageBoxRequest(BaseModel):
    command_name: str
    payload: dict


class MessageBoxRequestHandler:
    @staticmethod
    def handle(request: MessageBoxRequest):
        identity = get_identity()
        if identity is None:
            raise UnauthorizedException()

        user_id = identity.user_id

        try:
            command = command_factory.create_from_request_body(
                user_id=user_id,
                body={
                    'command_name': request.command_name,
                    'payload': request.payload,
                },
            )
            assert_identity_can_execute_command(identity, command)
            project_command_bus.dispatch(command)
            return generate_response_for(command)
        except NotFoundException as e:
            return HttpResponse.error(str(e), status_code=404)
        except InsufficientPermissionsException as e:
            return HttpResponse.error(str(e), status_code=403)
        except ValueError as e:
            capture_exception(e)
            return HttpResponse.error(str(e), status_code=400)
        except Exception as e:
            capture_exception(e)
            return HttpResponse.error(str(e), status_code=500)
