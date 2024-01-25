from morpheus.common.types import Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope


class EventStoreBase:
    def insert(self, event_envelope: EventEnvelope):
        raise NotImplementedError()

    def find_all_ordered_by_version(self) -> list[EventEnvelope]:
        raise NotImplementedError()

    def find_all_by_entity_uuid_ordered_by_version(self, entity_uuid: Uuid) -> list[EventEnvelope]:
        raise NotImplementedError()


class EventStore:
    def __init__(self, event_store_repository: EventStoreBase):
        self.event_store_repository = event_store_repository

    def store(self, event_envelope: EventEnvelope):
        self.event_store_repository.insert(event_envelope)

    def find_all_ordered_by_version(self) -> list[EventEnvelope]:
        return self.event_store_repository.find_all_ordered_by_version()

    def find_all_by_entity_uuid_ordered_by_version(self, entity_uuid: Uuid) -> list[EventEnvelope]:
        return self.event_store_repository.find_all_by_entity_uuid_ordered_by_version(entity_uuid)
