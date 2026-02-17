import dataclasses

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventName import EventName


@dataclasses.dataclass(frozen=True)
class EventBase:
    entity_uuid: Uuid
    occurred_at: DateTime
    payload: dict
    version: int

    @classmethod
    def create(cls, entity_uuid: Uuid, occurred_at: DateTime, payload: dict, event_version: int = 0):
        return cls(
            entity_uuid=entity_uuid,
            occurred_at=occurred_at,
            payload=payload,
            version=event_version
        )

    @staticmethod
    def get_event_name() -> EventName:
        raise NotImplementedError()

    def get_entity_uuid(self) -> Uuid:
        return self.entity_uuid

    def get_event_version(self) -> int:
        return self.version if self.version is not None else 0

    def get_payload(self) -> dict:
        return self.payload

    def get_occurred_at(self) -> DateTime:
        return self.occurred_at
