from morpheus.common.infrastructure.event_sourcing.EventStore import EventStoreBase
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.user.infrastructure.persistence.UserEventRepository import user_event_repository, UserEventRepository


class UserEventStore(EventStoreBase):
    def __init__(self, repository: UserEventRepository):
        self.repository = repository
        super().__init__()

    def store(self, event_envelope: EventEnvelope):
        self.repository.insert(event_envelope=event_envelope)


user_event_store = UserEventStore(repository=user_event_repository)
