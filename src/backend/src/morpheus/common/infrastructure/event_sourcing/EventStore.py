from morpheus.common.types import Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope


class EventStoreBase:
    def store(self, event_envelope: EventEnvelope):
        raise NotImplementedError()

    def get_all_events_ordered_by_version(self) -> list[EventEnvelope]:
        raise NotImplementedError()

    def get_all_by_entity_uuid_ordered_by_version(self, entity_uuid: Uuid) -> list[EventEnvelope]:
        raise NotImplementedError()
