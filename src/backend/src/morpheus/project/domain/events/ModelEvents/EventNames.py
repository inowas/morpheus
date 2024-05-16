from enum import StrEnum


class GeneralModelEventName(StrEnum):
    MODEL_CREATED = 'Model Created'
    VERSION_ASSIGNED_TO_MODEL = 'Version Assigned to Model'
    VERSION_CREATED = 'Version Created'
    VERSION_DELETED = 'Version Deleted'
    VERSION_DESCRIPTION_UPDATED = 'Version Description Updated'

    def to_str(self):
        return self.value


class ModelDiscretizationEventName(StrEnum):
    MODEL_AFFECTED_CELLS_RECALCULATED = 'Model Affected Cells Recalculated'
    MODEL_AFFECTED_CELLS_UPDATED = 'Model Affected Cells Updated'
    MODEL_GEOMETRY_UPDATED = 'Model Geometry Updated'
    MODEL_GRID_RECALCULATED = 'Model Grid Recalculated'
    MODEL_GRID_UPDATED = 'Model Grid Updated'
    MODEL_TIME_DISCRETIZATION_UPDATED = 'Model Time Discretization Updated'

    def to_str(self):
        return self.value


class ModelLayerEventName(StrEnum):
    MODEL_LAYER_CONFINEMENT_UPDATED = 'Model Layer Confinement Updated'
    MODEL_LAYER_CLONED = 'Model Layer Cloned'
    MODEL_LAYER_CREATED = 'Model Layer Created'
    MODEL_LAYER_DELETED = 'Model Layer Deleted'
    MODEL_LAYER_METADATA_UPDATED = 'Model Layer Metadata Updated'
    MODEL_LAYER_ORDER_UPDATED = 'Model Layer Order Updated'
    MODEL_LAYER_PROPERTY_UPDATED = 'Model Layer Property Updated'

    def to_str(self):
        return self.value


class ModelBoundaryEventName(StrEnum):
    MODEL_BOUNDARY_ADDED = 'Model Boundary Added'
    MODEL_BOUNDARY_REMOVED = 'Model Boundary Removed'
    MODEL_BOUNDARY_METADATA_UPDATED = 'Model Boundary Metadata Updated'
    MODEL_BOUNDARY_ENABLED = 'Model Boundary Enabled'
    MODEL_BOUNDARY_DISABLED = 'Model Boundary Disabled'
    MODEL_BOUNDARY_OBSERVATION_ADDED = 'Model Boundary Observation Added'
    MODEL_BOUNDARY_OBSERVATION_REMOVED = 'Model Boundary Observation Removed'
    MODEL_BOUNDARY_OBSERVATION_UPDATED = 'Model Boundary Observation Updated'

    def to_str(self):
        return self.value
