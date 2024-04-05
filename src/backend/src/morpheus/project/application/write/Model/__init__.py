from .CreateLayer import CreateLayerCommand, CreateLayerCommandHandler
from .CreateModel import CreateModelCommand, CreateModelCommandHandler
from .CreateVersion import CreateVersionCommand, CreateVersionCommandHandler
from .DeleteVersion import DeleteVersionCommand, DeleteVersionCommandHandler
from .DeleteLayer import DeleteLayerCommand, DeleteLayerCommandHandler
from .UpdateLayer import UpdateLayerCommand, UpdateLayerCommandHandler
from .UpdateModelAffectedCells import UpdateModelAffectedCellsCommand, UpdateModelAffectedCellsCommandHandler
from .UpdateModelGeometry import UpdateModelGeometryCommand, UpdateModelGeometryCommandHandler
from .UpdateModelGrid import UpdateModelGridCommand, UpdateModelGridCommandHandler
from .UpdateModelTimeDiscretization import UpdateModelTimeDiscretizationCommand, UpdateModelTimeDiscretizationCommandHandler
from .UpdateVersionDescription import UpdateVersionDescriptionCommand, UpdateVersionDescriptionCommandHandler

model_command_handler_map = {
    CreateLayerCommand: CreateLayerCommandHandler,
    CreateModelCommand: CreateModelCommandHandler,
    CreateVersionCommand: CreateVersionCommandHandler,
    DeleteVersionCommand: DeleteVersionCommandHandler,
    DeleteLayerCommand: DeleteLayerCommandHandler,
    UpdateLayerCommand: UpdateLayerCommandHandler,
    UpdateModelAffectedCellsCommand: UpdateModelAffectedCellsCommandHandler,
    UpdateModelGeometryCommand: UpdateModelGeometryCommandHandler,
    UpdateModelGridCommand: UpdateModelGridCommandHandler,
    UpdateModelTimeDiscretizationCommand: UpdateModelTimeDiscretizationCommandHandler,
    UpdateVersionDescriptionCommand: UpdateVersionDescriptionCommandHandler,
}
