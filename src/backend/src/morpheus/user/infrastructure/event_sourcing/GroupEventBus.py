from morpheus.common.infrastructure.event_sourcing.EventBus import EventBus
from morpheus.common.infrastructure.event_sourcing.EventPublisher import EventPublisher
from morpheus.user.application.projectors.GroupProjector import group_projector
from morpheus.user.infrastructure.event_sourcing.GroupEventStore import group_event_store


def create_event_bus():
    event_publisher = EventPublisher()
    event_publisher.register(event_listener=group_projector)

    return EventBus(event_publisher=event_publisher, event_store=group_event_store)


group_event_bus = create_event_bus()
