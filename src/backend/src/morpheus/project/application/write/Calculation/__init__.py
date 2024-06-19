from .AddCalculationProfile import AddCalculationProfileCommand, AddCalculationProfileCommandHandler
from .DeleteCalculation import DeleteCalculationCommand, DeleteCalculationCommandHandler
from .RemoveCalculationProfile import RemoveCalculationProfileCommand, RemoveCalculationProfileCommandHandler
from .StartCalculation import StartCalculationCommand, StartCalculationCommandHandler
from .StopCalculation import StopCalculationCommand, StopCalculationCommandHandler
from .UpdateCalculationProfile import UpdateCalculationProfileCommand, UpdateCalculationProfileCommandHandler

calculation_command_handler_map = {
    AddCalculationProfileCommand: AddCalculationProfileCommandHandler,
    DeleteCalculationCommand: DeleteCalculationCommandHandler,
    RemoveCalculationProfileCommand: RemoveCalculationProfileCommandHandler,
    StartCalculationCommand: StartCalculationCommandHandler,
    StopCalculationCommand: StopCalculationCommandHandler,
    UpdateCalculationProfileCommand: UpdateCalculationProfileCommandHandler,
}
