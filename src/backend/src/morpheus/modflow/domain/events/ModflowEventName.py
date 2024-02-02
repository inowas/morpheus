from enum import StrEnum


class ModflowEventName(StrEnum):
    BASE_MODEL_AFFECTED_CELLS_RECALCULATED = 'Base Model Affected Cells Recalculated'
    BASE_MODEL_AFFECTED_CELLS_UPDATED = 'Base Model Affected Cells Updated'
    BASE_MODEL_CREATED = 'Base Model Created'
    BASE_MODEL_GEOMETRY_UPDATED = 'Base Model Geometry Updated'
    BASE_MODEL_GRID_UPDATED = 'Base Model Grid Updated'
    BASE_MODEL_TIME_DISCRETIZATION_UPDATED = 'Base Model Time Discretization Updated'
    MEMBER_ADDED = 'Member Added'
    MEMBER_REMOVED = 'Member Removed'
    MEMBER_ROLE_UPDATED = 'Member Role Updated'
    OWNERSHIP_UPDATED = 'Ownership Updated'
    PROJECT_CREATED = 'Project Created'
    PROJECT_METADATA_UPDATED = 'Project Metadata Updated'
    VERSION_ASSIGNED_TO_BASEMODEL = 'Version Assigned to BaseModel'
    VERSION_CREATED = 'Version Created'
    VERSION_DELETED = 'Version Deleted'
    VERSION_DESCRIPTION_UPDATED = 'Version Description Updated'
    VISIBILITY_UPDATED = 'Visibility Updated'

    def to_str(self):
        return self.value
