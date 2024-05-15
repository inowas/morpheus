from . import GeneralModelEvents, ModelBoundaryEvents, ModelDiscretizationEvents, ModelLayerEvents

general_model_event_list = [
    GeneralModelEvents.ModelCreatedEvent,
    GeneralModelEvents.VersionAssignedToModelEvent,
    GeneralModelEvents.VersionCreatedEvent,
    GeneralModelEvents.VersionDeletedEvent,
    GeneralModelEvents.VersionDescriptionUpdatedEvent,
]

model_boundary_event_list = [
    ModelBoundaryEvents.ModelBoundaryAddedEvent,
    ModelBoundaryEvents.ModelBoundaryRemovedEvent,
]

model_discretization_event_list = [
    ModelDiscretizationEvents.ModelAffectedCellsRecalculatedEvent,
    ModelDiscretizationEvents.ModelAffectedCellsUpdatedEvent,
    ModelDiscretizationEvents.ModelGeometryUpdatedEvent,
    ModelDiscretizationEvents.ModelGridRecalculatedEvent,
    ModelDiscretizationEvents.ModelGridUpdatedEvent,
    ModelDiscretizationEvents.ModelTimeDiscretizationUpdatedEvent,
]

model_layer_event_list = [
    ModelLayerEvents.ModelLayerConfinementUpdatedEvent,
    ModelLayerEvents.ModelLayerClonedEvent,
    ModelLayerEvents.ModelLayerCreatedEvent,
    ModelLayerEvents.ModelLayerDeletedEvent,
    ModelLayerEvents.ModelLayerMetadataUpdatedEvent,
    ModelLayerEvents.ModelLayerOrderUpdatedEvent,
    ModelLayerEvents.ModelLayerPropertyUpdatedEvent,
]


def get_model_event_list():
    return general_model_event_list + model_boundary_event_list + model_discretization_event_list + model_layer_event_list