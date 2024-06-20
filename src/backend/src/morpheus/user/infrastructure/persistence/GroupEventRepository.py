from morpheus.common.infrastructure.persistence.event_sourcing.EventRepository import create_event_repository
from morpheus.settings import settings
from morpheus.user.domain.events.GroupEvents import group_event_factory

group_event_repository = create_event_repository(
    database_name=settings.MONGO_USER_DATABASE,
    collection_name='group_events',
    event_factory=group_event_factory,
)
