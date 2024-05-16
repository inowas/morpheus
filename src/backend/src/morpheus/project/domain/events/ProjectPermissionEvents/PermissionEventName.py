from enum import StrEnum


class PermissionEventName(StrEnum):
    PROJECT_MEMBER_ADDED = 'Project Member Added'
    PROJECT_MEMBER_REMOVED = 'Project Member Removed'
    PROJECT_MEMBER_ROLE_UPDATED = 'Project Member Role Updated'
    PROJECT_OWNERSHIP_UPDATED = 'Project Ownership Updated'
    PROJECT_VISIBILITY_UPDATED = 'Project Visibility Updated'

    def to_str(self):
        return self.value
