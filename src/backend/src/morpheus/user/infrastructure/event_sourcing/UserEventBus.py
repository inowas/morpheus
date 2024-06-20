from morpheus.common.infrastructure.event_sourcing.EventBus import EventBus
from morpheus.common.infrastructure.event_sourcing.EventPublisher import EventPublisher
from morpheus.user.application.projectors.UserProjector import user_projector
from morpheus.user.infrastructure.event_sourcing.UserEventStore import user_event_store


def create_event_bus():
    event_publisher = EventPublisher()
    event_publisher.register(event_listener=user_projector)

    return EventBus(event_publisher=event_publisher, event_store=user_event_store)


user_event_bus = create_event_bus()
