import dataclasses

from morpheus.common.types import Uuid
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.common.types.event_sourcing.EventPayloadBase import EventPayloadBase


@dataclasses.dataclass(frozen=True)
class EventBase:
    @classmethod
    def from_payload(cls, payload: EventPayloadBase):
        raise NotImplementedError()

    def get_payload(self) -> EventPayloadBase:
        raise NotImplementedError()

    def get_event_name(self) -> EventName:
        raise NotImplementedError()

    def get_event_entity_uuid(self) -> Uuid:
        raise NotImplementedError()
