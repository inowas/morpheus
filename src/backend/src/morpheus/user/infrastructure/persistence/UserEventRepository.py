from morpheus.common.infrastructure.persistence.event_sourcing.EventRepository import create_event_repository
from morpheus.settings import settings
from morpheus.user.domain.events.UserEvents import user_event_factory

user_event_repository = create_event_repository(
    database_name=settings.MONGO_USER_DATABASE,
    collection_name='user_events',
    event_factory=user_event_factory,
)
