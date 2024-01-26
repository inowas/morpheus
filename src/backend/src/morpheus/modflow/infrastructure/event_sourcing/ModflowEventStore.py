from morpheus.common.infrastructure.event_sourcing.EventStore import EventStoreBase
from morpheus.common.types import Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.modflow.infrastructure.persistence.ModflowEventRepository import modflow_event_repository, ModflowEventRepository


class ModflowEventStore(EventStoreBase):
    def __init__(self, repository: ModflowEventRepository):
        self.repository = repository
        super().__init__()

    def store(self, event_envelope: EventEnvelope):
        self.repository.insert(event_envelope=event_envelope)

    def get_all_events_ordered_by_version(self) -> list[EventEnvelope]:
        return self.repository.find_all_ordered_by_version()

    def get_all_by_entity_uuid_ordered_by_version(self, entity_uuid: Uuid) -> list[EventEnvelope]:
        return self.repository.find_all_by_entity_uuid_ordered_by_version(entity_uuid=entity_uuid)


modflow_event_store = ModflowEventStore(repository=modflow_event_repository)
