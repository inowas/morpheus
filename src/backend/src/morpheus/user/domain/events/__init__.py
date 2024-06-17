from morpheus.common.infrastructure.event_sourcing.EventFactory import EventRegistry, EventFactory
from morpheus.user.domain.events.GroupEvents import get_group_event_list
from morpheus.user.domain.events.UserEvents import get_user_event_list

event_registry = EventRegistry()
for event in get_group_event_list():
    event_registry.register_event(event)
for event in get_user_event_list():
    event_registry.register_event(event)

event_factory = EventFactory(event_registry)
