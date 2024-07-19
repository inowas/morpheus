from typing import Type

from morpheus.project.application.write.Asset import asset_command_handler_map
from morpheus.project.application.write.Calculation import calculation_command_handler_map
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.Model import model_command_handler_map
from morpheus.project.application.write.Project import project_command_handler_map


class CommandFactory:
    def __init__(self, registry: dict[str, Type[CommandBase]]):
        self._registry = registry

    def create_from_request_body(self, user_id, body):
        command_name = body.get('command_name', None)
        if command_name is None:
            raise ValueError('Missing command field in request body')

        payload = body.get('payload', None)
        if payload is None:
            raise ValueError('Missing payload field in request body')

        if command_name not in self._registry:
            raise ValueError(f'Command name {command_name} not recognized')

        return self._registry[command_name].from_payload(user_id=user_id, payload=payload)


command_registry = {}

for command in calculation_command_handler_map.keys():
    command_registry[command.command_name()] = command
for command in asset_command_handler_map.keys():
    command_registry[command.command_name()] = command
for command in model_command_handler_map.keys():
    command_registry[command.command_name()] = command
for command in project_command_handler_map.keys():
    command_registry[command.command_name()] = command

command_factory = CommandFactory(registry=command_registry)
