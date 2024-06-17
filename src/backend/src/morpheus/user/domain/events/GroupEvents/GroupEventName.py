from enum import StrEnum


class GroupEventName(StrEnum):
    GROUP_CREATED = 'Group Created'
    GROUP_MEMBER_ADDED = 'Group Member Added'
    GROUP_MEMBER_REMOVED = 'Group Member Removed'
    GROUP_ADMIN_ADDED = 'Group Admin Added'
    GROUP_ADMIN_REMOVED = 'Group Admin Removed'

    def to_str(self):
        return self.value
