from .StartCalculation import StartCalculationCommand, StartCalculationCommandHandler

calculation_command_handler_map = {
    StartCalculationCommand: StartCalculationCommandHandler,
}
