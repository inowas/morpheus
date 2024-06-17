import dataclasses

import pymongo
from pymongo.collection import Collection

from morpheus.common.infrastructure.event_sourcing.EventFactory import EventFactory
from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.settings import settings
from morpheus.user.domain.events import event_factory


@dataclasses.dataclass(frozen=True)
class UserEventStoreDocument:
    event_name: str
    occurred_at: str
    entity_uuid: str
    version: int
    payload: dict
    metadata: dict

    @classmethod
    def from_envelope_and_version(cls, envelope: EventEnvelope, version: int):
        event = envelope.get_event()
        return cls(
            event_name=event.get_event_name().to_str(),
            occurred_at=event.get_occurred_at().to_iso_with_timezone(),
            entity_uuid=event.get_entity_uuid().to_str(),
            version=version,
            payload=event.get_payload(),
            metadata=envelope.get_event_metadata().to_dict(),
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            event_name=obj['event_name'],
            occurred_at=obj['occurred_at'],
            entity_uuid=obj['entity_uuid'],
            version=obj['version'],
            payload=obj['payload'],
            metadata=obj['metadata'],
        )

    def to_dict(self) -> dict:
        return {
            'event_name': self.event_name,
            'occurred_at': self.occurred_at,
            'entity_uuid': self.entity_uuid,
            'version': self.version,
            'payload': self.payload,
            'metadata': self.metadata,
        }


class UserEventRepository(RepositoryBase):

    def __init__(self, collection: Collection, event_factory: EventFactory):
        super().__init__(collection)
        self.event_factory = event_factory

    def insert(self, event_envelope: EventEnvelope):
        version = self._get_next_version_for_entity_uuid(
            entity_uuid=event_envelope.get_event().get_entity_uuid().to_str()
        )

        self.collection.insert_one(UserEventStoreDocument.from_envelope_and_version(event_envelope, version).to_dict())

    def _get_next_version_for_entity_uuid(self, entity_uuid: str) -> int:
        count = self.collection.count_documents(
            filter={
                'entity_uuid': entity_uuid,
            },
        )

        return count + 1


user_event_repository = UserEventRepository(
    collection=create_or_get_collection(
        get_database_client(settings.MONGO_USER_DATABASE, create_if_not_exist=True),
        'user_events',
        lambda collection: collection.create_index(
            [
                ('entity_uuid', pymongo.ASCENDING),
                ('version', pymongo.ASCENDING),
            ],
            unique=True,
        )
    ),
    event_factory=event_factory,
)
