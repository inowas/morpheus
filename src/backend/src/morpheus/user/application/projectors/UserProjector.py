from morpheus.common.infrastructure.event_sourcing.EventPublisher import EventListenerBase, listen_to
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.user.domain.events.UserEvents import UserCreatedEvent, UserLinkedToKeycloakEvent, UserDataUpdatedEvent, UserPromotedToAdminEvent, UserDemotedFromAdminEvent
from morpheus.user.infrastructure.persistence.UserRepository import UserRepository, user_repository
from morpheus.user.types.User import User


class UserProjector(EventListenerBase):
    def __init__(self, user_repository: UserRepository) -> None:
        self.user_repository = user_repository

    @listen_to(UserCreatedEvent)
    def on_user_created(self, event: UserCreatedEvent, metadata: EventMetadata) -> None:
        user = User(
            user_id=event.get_user_id(),
            keycloak_user_id=None,
            geo_node_user_id=None,
            is_admin=False,
            user_data=event.get_user_data()
        )
        self.user_repository.add_user(user)

    @listen_to(UserDataUpdatedEvent)
    def on_user_data_updated(self, event: UserDataUpdatedEvent, metadata: EventMetadata) -> None:
        self.user_repository.update_user_data(event.get_user_id(), event.get_user_data())

    @listen_to(UserLinkedToKeycloakEvent)
    def on_user_linked_to_keycloak(self, event: UserLinkedToKeycloakEvent, metadata: EventMetadata) -> None:
        self.user_repository.set_keycloak_id_for_user(event.get_user_id(), event.get_keycloak_user_id())

    @listen_to(UserPromotedToAdminEvent)
    def on_user_promoted_to_admin(self, event: UserLinkedToKeycloakEvent, metadata: EventMetadata) -> None:
        self.user_repository.set_admin_flag_for_user(event.get_user_id(), is_admin=True)

    @listen_to(UserDemotedFromAdminEvent)
    def on_user_demoted_from_admin(self, event: UserLinkedToKeycloakEvent, metadata: EventMetadata) -> None:
        self.user_repository.set_admin_flag_for_user(event.get_user_id(), is_admin=False)


user_projector = UserProjector(user_repository)
