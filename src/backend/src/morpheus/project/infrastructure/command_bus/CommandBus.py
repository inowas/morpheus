from typing import Type

from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase


class CommandBus:
    command_handlers = {}

    def register(self, command: Type[CommandBase], handler: Type[CommandHandlerBase]):
        self.command_handlers[command.command_name()] = handler

    def dispatch(self, command: Type[CommandBase]):
        handler = self.command_handlers[command.command_name()]
        return handler.handle(command)
