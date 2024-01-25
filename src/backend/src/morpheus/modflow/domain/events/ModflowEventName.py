from enum import StrEnum


class ModflowEventName(StrEnum):
    PROJECT_CREATED = 'Project Created'
    PROJECT_METADATA_UPDATED = 'Project Metadata Updated'
    BASE_MODEL_CREATED = 'Base Model Created'
    MEMBER_ADDED = 'Member Added'
    MEMBER_REMOVED = 'Member Removed'
    MEMBER_ROLE_UPDATED = 'Member Role Updated'
    OWNERSHIP_UPDATED = 'Ownership Updated'
    VISIBILITY_UPDATED = 'Visibility Updated'

    def to_str(self):
        return self.value
