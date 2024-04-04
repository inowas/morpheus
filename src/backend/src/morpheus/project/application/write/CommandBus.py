from typing import Type

from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.application.write.Model import model_command_handler_map
from morpheus.project.application.write.Project import project_command_handler_map


class CommandBus:
    command_handlers = {}

    def __init__(self):
        [self.register(command, handler) for command, handler in model_command_handler_map.items()]
        [self.register(command, handler) for command, handler in project_command_handler_map.items()]

    def register(self, command: Type[CommandBase], handler: Type[CommandHandlerBase]):
        self.command_handlers[command.command_name()] = handler

    def dispatch(self, command: Type[CommandBase]):
        handler = self.command_handlers[command.command_name()]
        return handler.handle(command)
