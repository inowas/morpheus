from enum import StrEnum


class ProjectEventName(StrEnum):
    MODEL_AFFECTED_CELLS_RECALCULATED = 'Model Affected Cells Recalculated'
    MODEL_AFFECTED_CELLS_UPDATED = 'Model Affected Cells Updated'
    MODEL_CREATED = 'Model Created'
    MODEL_GEOMETRY_UPDATED = 'Model Geometry Updated'
    MODEL_GRID_UPDATED = 'Model Grid Updated'
    MODEL_TIME_DISCRETIZATION_UPDATED = 'Model Time Discretization Updated'
    MEMBER_ADDED = 'Member Added'
    MEMBER_REMOVED = 'Member Removed'
    MEMBER_ROLE_UPDATED = 'Member Role Updated'
    OWNERSHIP_UPDATED = 'Ownership Updated'
    PROJECT_CREATED = 'Project Created'
    PROJECT_METADATA_UPDATED = 'Project Metadata Updated'
    PROJECT_PREVIEW_IMAGE_UPDATED = 'Project Preview Image Updated'
    PROJECT_PREVIEW_IMAGE_DELETED = 'Project Preview Image Deleted'
    VERSION_ASSIGNED_TO_MODEL = 'Version Assigned to Model'
    VERSION_CREATED = 'Version Created'
    VERSION_DELETED = 'Version Deleted'
    VERSION_DESCRIPTION_UPDATED = 'Version Description Updated'
    VISIBILITY_UPDATED = 'Visibility Updated'

    def to_str(self):
        return self.value
