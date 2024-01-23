import dataclasses

from morpheus.common.types import DateTime
from morpheus.common.types.event_sourcing import EventMetadata
from morpheus.common.types.event_sourcing.EventBase import EventBase


@dataclasses.dataclass(frozen=True)
class EventEnvelope:
    event: EventBase
    occurred_at: DateTime
    metadata: EventMetadata

    def get_event(self) -> EventBase:
        return self.event

    def get_occurred_at(self) -> DateTime:
        return self.occurred_at

    def get_event_metadata(self) -> EventMetadata:
        return self.metadata
