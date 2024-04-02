from enum import StrEnum


class CommandName(StrEnum):
    CREATE_PROJECT = 'Create Project'
    DELETE_PROJECT = 'Delete Project'
    UPDATE_PROJECT_METADATA = 'Update Project Metadata'
    UPDATE_PROJECT_PREVIEW_IMAGE = 'Update Project Preview Image'

    CREATE_MODEL = 'Create Model'
    UPDATE_MODEL_AFFECTED_CELLS = 'Update Model Affected Cells'
    UPDATE_MODEL_GEOMETRY = 'Update Model Geometry'
    UPDATE_MODEL_GRID = 'Update Model Grid'
    UPDATE_MODEL_TIME_DISCRETIZATION = 'Update Model Time Discretization'

    CREATE_VERSION = 'Create Version'
    DELETE_VERSION = 'Delete Version'
    UPDATE_VERSION_DESCRIPTION = 'Update Version Description'

    ADD_MEMBER = 'Add Member'
    REMOVE_MEMBER = 'Remove Member'
    UPDATE_MEMBER_ROLE = 'Update Member Role'
    UPDATE_VISIBILITY = 'Update Visibility'

    def to_str(self):
        return self.value

    @classmethod
    def from_str(cls, name: str):
        return CommandName(name)
