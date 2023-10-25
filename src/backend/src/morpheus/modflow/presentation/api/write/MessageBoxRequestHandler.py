import dataclasses

from flask import Request, abort

from ....application.write.CreateModflowModel import CreateModflowModelCommand, CreateModflowModelCommandHandler


@dataclasses.dataclass
class Message:
    uuid: str
    message_name: str
    metadata: dict
    payload: dict

    @classmethod
    def from_request_body(cls, body: dict):
        return cls(
            uuid=body['uuid'],
            message_name=body['message_name'],
            metadata=body['metadata'] if 'metadata' in body else {},
            payload=body['payload']
        )


class MessageBoxRequestHandler:
    def handle(self, request: Request):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        try:
            message = Message.from_request_body(request.get_json())
        except KeyError as e:
            abort(400, f'Missing required key in request body: {e}')

        if message.message_name == CreateModflowModelCommand.message_name:
            self.handle_create_modflow_model_command(CreateModflowModelCommand.from_dict(message.payload))

    @staticmethod
    def handle_create_modflow_model_command(command: CreateModflowModelCommand):
        result = CreateModflowModelCommandHandler.handle(command=command)
        return result.to_dict()
