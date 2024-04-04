from typing import Type

from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.Model import model_command_handler_map
from morpheus.project.application.write.Project import project_command_handler_map
from morpheus.project.types.User import UserId


class CommandFactory:
    user_id: UserId
    registry = {}

    def __init__(self, user_id: UserId):
        self.user_id = user_id
        for command in model_command_handler_map.keys():
            self.register(command)
        for command in project_command_handler_map.keys():
            self.register(command)

    def register(self, command: Type[CommandBase]):
        if command.command_name() in self.registry:
            raise ValueError(f'Command name {command.command_name()} already registered')
        self.registry[command.command_name()] = command

    def create_from_request_body(self, body):
        command_name = body.get('command_name', None)
        if command_name is None:
            raise ValueError('Missing command field in request body')

        payload = body.get('payload', None)
        if payload is None:
            raise ValueError('Missing payload field in request body')

        if command_name not in self.registry:
            raise ValueError(f'Command name {command_name} not recognized')

        return self.registry[command_name].from_payload(user_id=self.user_id, payload=payload)
