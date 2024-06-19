from morpheus.common.infrastructure.persistence.event_sourcing.EventRepository import EventRepository
from morpheus.common.types import Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope


class EventStore:
    def __init__(self, repository: EventRepository):
        self.repository = repository

    def store(self, event_envelope: EventEnvelope):
        self.repository.insert(event_envelope=event_envelope)

    def get_all_events_ordered_by_version(self) -> list[EventEnvelope]:
        raise NotImplementedError()

    def get_all_by_entity_uuid_ordered_by_version(self, entity_uuid: Uuid) -> list[EventEnvelope]:
        raise NotImplementedError()
