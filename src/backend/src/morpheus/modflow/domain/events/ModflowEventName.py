from enum import StrEnum


class ModflowEventName(StrEnum):
    BASE_MODEL_CREATED = 'Base Model Created'
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
