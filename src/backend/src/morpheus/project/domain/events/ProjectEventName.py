from enum import StrEnum


class ProjectEventName(StrEnum):
    PROJECT_CREATED = 'Project Created'
    PROJECT_DELETED = 'Project Deleted'
    PROJECT_METADATA_UPDATED = 'Project Metadata Updated'
    PROJECT_PREVIEW_IMAGE_UPDATED = 'Project Preview Image Updated'
    PROJECT_PREVIEW_IMAGE_DELETED = 'Project Preview Image Deleted'

    PROJECT_MEMBER_ADDED = 'Project Member Added'
    PROJECT_MEMBER_REMOVED = 'Project Member Removed'
    PROJECT_MEMBER_ROLE_UPDATED = 'Project Member Role Updated'
    PROJECT_OWNERSHIP_UPDATED = 'Project Ownership Updated'

    MODEL_AFFECTED_CELLS_RECALCULATED = 'Model Affected Cells Recalculated'
    MODEL_AFFECTED_CELLS_UPDATED = 'Model Affected Cells Updated'
    MODEL_CREATED = 'Model Created'
    MODEL_GEOMETRY_UPDATED = 'Model Geometry Updated'
    MODEL_GRID_RECALCULATED = 'Model Grid Recalculated'
    MODEL_GRID_UPDATED = 'Model Grid Updated'
    MODEL_TIME_DISCRETIZATION_UPDATED = 'Model Time Discretization Updated'

    MODEL_LAYER_CREATED = 'Model Layer Created'
    MODEL_LAYER_DELETED = 'Model Layer Deleted'
    MODEL_LAYER_UPDATED = 'Model Layer Updated'
    MODEL_LAYER_PROPERTY_UPDATED = 'Model Layer Property Updated'

    VERSION_ASSIGNED_TO_MODEL = 'Version Assigned to Model'
    VERSION_CREATED = 'Version Created'
    VERSION_DELETED = 'Version Deleted'
    VERSION_DESCRIPTION_UPDATED = 'Version Description Updated'
    VISIBILITY_UPDATED = 'Visibility Updated'

    def to_str(self):
        return self.value
