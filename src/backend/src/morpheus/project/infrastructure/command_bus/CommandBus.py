from typing import Type

from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase


class CommandBus:

    def __init__(self):
        self._command_handlers = {}

    def register(self, command: Type[CommandBase], handler: Type[CommandHandlerBase]):
        self._command_handlers[command.command_name()] = handler

    def dispatch(self, command: Type[CommandBase]):
        handler = self._command_handlers[command.command_name()]
        return handler.handle(command)
