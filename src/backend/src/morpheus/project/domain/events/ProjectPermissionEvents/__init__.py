from . import PermissionEvents

event_list = [
    PermissionEvents.MemberAddedEvent,
    PermissionEvents.MemberRemovedEvent,
    PermissionEvents.MemberRoleUpdatedEvent,
    PermissionEvents.OwnershipUpdatedEvent,
    PermissionEvents.VisibilityUpdatedEvent,
]


def get_project_permissions_event_list():
    return event_list
