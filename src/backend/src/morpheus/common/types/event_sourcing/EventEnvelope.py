import dataclasses

from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.event_sourcing.EventBase import EventBase


@dataclasses.dataclass(frozen=True)
class EventEnvelope:
    event: EventBase
    metadata: EventMetadata

    def get_event(self) -> EventBase:
        return self.event

    def get_event_metadata(self) -> EventMetadata:
        return self.metadata
