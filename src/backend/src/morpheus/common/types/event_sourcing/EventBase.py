import dataclasses

from morpheus.common.types import Uuid
from morpheus.common.types.event_sourcing.EventName import EventName


@dataclasses.dataclass(frozen=True)
class EventBase:
    entity_uuid: Uuid
    payload: dict

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            entity_uuid=Uuid.from_str(obj['entity_uuid']),
            payload=obj['payload'],
        )

    def get_entity_uuid(self) -> Uuid:
        return self.entity_uuid

    def get_event_name(self) -> EventName:
        raise NotImplementedError()

    def get_payload(self) -> dict:
        return self.payload
