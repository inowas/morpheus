from .UpdateModelAffectedCells import UpdateModelAffectedCellsCommand, UpdateModelAffectedCellsCommandHandler
from .UpdateModelGeometry import UpdateModelGeometryCommand, UpdateModelGeometryCommandHandler
from .UpdateModelGrid import UpdateModelGridCommand, UpdateModelGridCommandHandler
from .UpdateModelTimeDiscretization import UpdateModelTimeDiscretizationCommand, UpdateModelTimeDiscretizationCommandHandler

model_discretization_command_handler_map = {
    UpdateModelAffectedCellsCommand: UpdateModelAffectedCellsCommandHandler,
    UpdateModelGeometryCommand: UpdateModelGeometryCommandHandler,
    UpdateModelGridCommand: UpdateModelGridCommandHandler,
    UpdateModelTimeDiscretizationCommand: UpdateModelTimeDiscretizationCommandHandler,
}