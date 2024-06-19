from morpheus.common.types import Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.project.infrastructure.persistence.ProjectEventRepository import project_event_repository, ProjectEventRepository


class ProjectEventStore:
    def __init__(self, repository: ProjectEventRepository):
        self.repository = repository

    def store(self, event_envelope: EventEnvelope):
        self.repository.insert(event_envelope=event_envelope)

    def get_all_events_ordered_by_version(self) -> list[EventEnvelope]:
        return self.repository.find_all_ordered_by_version()

    def get_all_by_entity_uuid_ordered_by_version(self, entity_uuid: Uuid) -> list[EventEnvelope]:
        return self.repository.find_all_by_entity_uuid_ordered_by_version(entity_uuid=entity_uuid)


project_event_store = ProjectEventStore(repository=project_event_repository)
