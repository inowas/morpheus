import dataclasses
from typing import Mapping, Any

import pymongo
from pymongo.collection import Collection
from morpheus.common.infrastructure.event_sourcing.EventFactory import EventFactory
from morpheus.common.infrastructure.persistence.event_sourcing.uuid7 import uuid7
from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.event_sourcing.EventName import EventName


@dataclasses.dataclass(frozen=True)
class EventStoreDocument:
    event_name: str
    occurred_at: str
    entity_uuid: str
    version: str
    payload: dict
    metadata: dict

    @classmethod
    def from_envelope_and_version(cls, envelope: EventEnvelope, version: str):
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
    def from_raw_document(cls, raw_document: Mapping[str, Any]):
        return cls(
            event_name=raw_document['event_name'],
            occurred_at=raw_document['occurred_at'],
            entity_uuid=raw_document['entity_uuid'],
            version=raw_document['version'],
            payload=raw_document['payload'],
            metadata=raw_document['metadata'],
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

    def to_envelope(self, event_factory: EventFactory) -> EventEnvelope:
        return EventEnvelope(
            event=event_factory.create_event(
                event_name=EventName.from_str(self.event_name),
                entity_uuid=Uuid.from_str(self.entity_uuid),
                occurred_at=DateTime.from_str(self.occurred_at),
                payload=self.payload
            ),
            metadata=EventMetadata.from_dict(self.metadata),
        )


class EventRepository(RepositoryBase):

    def __init__(self, collection: Collection, event_factory: EventFactory):
        super().__init__(collection)
        self._event_factory = event_factory

    def insert(self, event_envelope: EventEnvelope):
        self.collection.insert_one(
            EventStoreDocument.from_envelope_and_version(event_envelope, uuid7()).to_dict(),
        )

    def find_all_ordered_by_version(self):
        documents = self.collection.find({}).sort('version', pymongo.ASCENDING)
        return [EventStoreDocument.from_raw_document(document).to_envelope(self._event_factory) for document in documents]

    def find_all_by_entity_uuid_ordered_by_version(self, entity_uuid: Uuid) -> list[EventEnvelope]:
        documents = self.collection.find({'entity_uuid': entity_uuid.to_str()}).sort('version', pymongo.ASCENDING)
        return [EventStoreDocument.from_raw_document(document).to_envelope(self._event_factory) for document in documents]


def create_event_repository(
    database_name: str,
    collection_name: str,
    event_factory: EventFactory
) -> EventRepository:
    return EventRepository(
        collection=create_or_get_collection(
            get_database_client(database_name, create_if_not_exist=True),
            collection_name,
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
