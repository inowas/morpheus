from . import GroupEvents

event_list = [
    GroupEvents.GroupCreatedEvent,
    GroupEvents.MemberAddedEvent,
    GroupEvents.MemberRemovedEvent,
    GroupEvents.AdminAddedEvent,
    GroupEvents.AdminRemovedEvent,
]


def get_group_event_list():
    return event_list
