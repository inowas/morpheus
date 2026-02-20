from ...infrastructure.command_bus.CommandBus import CommandBus
from .Asset import asset_command_handler_map
from .Calculation import calculation_command_handler_map
from .Model import model_command_handler_map
from .Project import project_command_handler_map


def create_command_bus():
    command_bus = CommandBus()

    for command, handler in asset_command_handler_map.items():
        command_bus.register(command, handler)

    for command, handler in calculation_command_handler_map.items():
        command_bus.register(command, handler)

    for command, handler in model_command_handler_map.items():
        command_bus.register(command, handler)

    for command, handler in project_command_handler_map.items():
        command_bus.register(command, handler)

    return command_bus


project_command_bus = create_command_bus()
