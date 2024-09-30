from .AddModelBoundary import AddModelBoundaryCommand, AddModelBoundaryCommandHandler
from .AddModelBoundaryObservation import AddModelBoundaryObservationCommand, AddModelBoundaryObservationCommandHandler
from .CloneModelBoundary import CloneModelBoundaryCommand, CloneModelBoundaryCommandHandler
from .CloneModelBoundaryObservation import CloneModelBoundaryObservationCommand, CloneModelBoundaryObservationCommandHandler
from .DisableModelBoundary import DisableModelBoundaryCommand, DisableModelBoundaryCommandHandler
from .EnableModelBoundary import EnableModelBoundaryCommand, EnableModelBoundaryCommandHandler
from .ImportModelBoundaries import ImportModelBoundariesCommand, ImportModelBoundariesCommandHandler
from .RemoveModelBoundaries import RemoveModelBoundariesCommand, RemoveModelBoundariesCommandHandler
from .RemoveModelBoundaryObservation import RemoveModelBoundaryObservationCommand, RemoveModelBoundaryObservationCommandHandler
from .UpdateModelBoundaryAffectedCells import UpdateModelBoundaryAffectedCellsCommand, UpdateModelBoundaryAffectedCellsCommandHandler
from .UpdateModelBoundaryAffectedLayers import UpdateModelBoundaryAffectedLayersCommand, UpdateModelBoundaryAffectedLayersCommandHandler
from .UpdateModelBoundaryGeometry import UpdateModelBoundaryGeometryCommand, UpdateModelBoundaryGeometryCommandHandler
from .UpdateModelBoundaryInterpolation import UpdateModelBoundaryInterpolationCommand, UpdateModelBoundaryInterpolationCommandHandler
from .UpdateModelBoundaryMetadata import UpdateModelBoundaryMetadataCommand, UpdateModelBoundaryMetadataCommandHandler
from .UpdateModelBoundaryObservation import UpdateModelBoundaryObservationCommand, UpdateModelBoundaryObservationCommandHandler
from .UpdateModelBoundaryTags import UpdateModelBoundaryTagsCommand, UpdateModelBoundaryTagsCommandHandler

model_boundaries_command_handler_map = {
    AddModelBoundaryCommand: AddModelBoundaryCommandHandler,
    AddModelBoundaryObservationCommand: AddModelBoundaryObservationCommandHandler,
    CloneModelBoundaryCommand: CloneModelBoundaryCommandHandler,
    CloneModelBoundaryObservationCommand: CloneModelBoundaryObservationCommandHandler,
    DisableModelBoundaryCommand: DisableModelBoundaryCommandHandler,
    EnableModelBoundaryCommand: EnableModelBoundaryCommandHandler,
    ImportModelBoundariesCommand: ImportModelBoundariesCommandHandler,
    RemoveModelBoundariesCommand: RemoveModelBoundariesCommandHandler,
    RemoveModelBoundaryObservationCommand: RemoveModelBoundaryObservationCommandHandler,
    UpdateModelBoundaryAffectedCellsCommand: UpdateModelBoundaryAffectedCellsCommandHandler,
    UpdateModelBoundaryAffectedLayersCommand: UpdateModelBoundaryAffectedLayersCommandHandler,
    UpdateModelBoundaryGeometryCommand: UpdateModelBoundaryGeometryCommandHandler,
    UpdateModelBoundaryInterpolationCommand: UpdateModelBoundaryInterpolationCommandHandler,
    UpdateModelBoundaryMetadataCommand: UpdateModelBoundaryMetadataCommandHandler,
    UpdateModelBoundaryObservationCommand: UpdateModelBoundaryObservationCommandHandler,
    UpdateModelBoundaryTagsCommand: UpdateModelBoundaryTagsCommandHandler,
}
