import dataclasses

import pymongo
from pymongo.collection import Collection

from morpheus.common.infrastructure.event_sourcing.EventFactory import EventFactory
from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.project.domain.events.EventFactory import project_event_factory
from morpheus.settings import settings


@dataclasses.dataclass(frozen=True)
class ProjectEventStoreDocument:
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

    def to_envelope(self) -> EventEnvelope:
        return EventEnvelope(
            # the event factory should not be used here, instead it should be used in the repository
            event=project_event_factory.create_event(
                event_name=EventName.from_str(self.event_name),
                entity_uuid=Uuid.from_str(self.entity_uuid),
                occurred_at=DateTime.from_str(self.occurred_at),
                payload=self.payload
            ),
            metadata=EventMetadata.from_dict(self.metadata),
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


class ProjectEventRepository(RepositoryBase):

    def __init__(self, collection: Collection, event_factory: EventFactory):
        super().__init__(collection)
        self.event_factory = event_factory

    def insert(self, event_envelope: EventEnvelope):
        version = self._get_next_version_for_entity_uuid(
            entity_uuid=event_envelope.get_event().get_entity_uuid().to_str()
        )

        self.collection.insert_one(ProjectEventStoreDocument.from_envelope_and_version(event_envelope, version).to_dict())

    def _get_next_version_for_entity_uuid(self, entity_uuid: str) -> int:
        count = self.collection.count_documents(
            filter={
                'entity_uuid': entity_uuid,
            },
        )

        return count + 1

    def find_all_ordered_by_version(self):
        documents = self.collection.find({}).sort('version', pymongo.ASCENDING)
        return [ProjectEventStoreDocument.from_dict(document).to_envelope() for document in documents]

    def find_all_by_entity_uuid_ordered_by_version(self, entity_uuid: Uuid) -> list[EventEnvelope]:
        documents = self.collection.find({'entity_uuid': entity_uuid.to_str()}).sort('version', pymongo.ASCENDING)
        return [ProjectEventStoreDocument.from_dict(document).to_envelope() for document in documents]


project_event_repository = ProjectEventRepository(
    collection=create_or_get_collection(
        get_database_client(settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'project_events',
        lambda collection: collection.create_index(
            [
                ('entity_uuid', pymongo.ASCENDING),
                ('version', pymongo.ASCENDING),
            ],
            unique=True,
        )
    ),
    event_factory=project_event_factory,
)
