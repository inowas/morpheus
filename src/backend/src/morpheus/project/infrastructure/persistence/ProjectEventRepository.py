from morpheus.common.infrastructure.persistence.event_sourcing.EventRepository import create_event_repository
from morpheus.project.domain.events.EventFactory import project_event_factory
from morpheus.settings import settings

project_event_repository = create_event_repository(
    database_name=settings.MONGO_PROJECT_DATABASE,
    collection_name='project_events',
    event_factory=project_event_factory,
)
