from morpheus.common.infrastructure.event_sourcing.EventPublisher import EventPublisher
from morpheus.common.infrastructure.event_sourcing.EventStore import EventStore
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope


class EventBus:
    def __init__(self, event_store: EventStore, event_publisher: EventPublisher):
        self.event_store = event_store
        self.event_publisher = event_publisher

    def start_transaction(self):
        raise NotImplementedError()

    def commit_transaction(self):
        raise NotImplementedError()

    def rollback_transaction(self):
        raise NotImplementedError()

    def record(self, event_envelope: EventEnvelope):
        self.event_store.store(event_envelope)
        self.event_publisher.publish(event_envelope)
