import dataclasses

from morpheus.common.types import DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.identity.Identity import UserId
from morpheus.user.application.read.UserReader import user_reader
from morpheus.user.domain.events.UserEvents import UserDataUpdatedEvent, UserDemotedFromAdminEvent, UserPromotedToAdminEvent, UserCreatedEvent, UserLinkedToKeycloakEvent
from morpheus.user.infrastructure.event_sourcing.UserEventBus import user_event_bus
from morpheus.user.types.User import KeycloakUserId, UserEmail, Username, UserFirstName, UserLastName, UserData, User


@dataclasses.dataclass(frozen=True)
class CreateOrUpdateUserFromKeycloakCommand:
    keycloak_user_id: KeycloakUserId
    is_admin: bool
    email: UserEmail
    username: Username
    first_name: UserFirstName | None
    last_name: UserLastName | None

    @classmethod
    def as_admin_user(cls, keycloak_user_id: KeycloakUserId, email: UserEmail, username: Username, first_name: UserFirstName | None, last_name: UserLastName | None):
        return cls(
            keycloak_user_id=keycloak_user_id,
            is_admin=True,
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
        )

    @classmethod
    def as_normal_user(cls, keycloak_user_id: KeycloakUserId, email: UserEmail, username: Username, first_name: UserFirstName | None, last_name: UserLastName | None):
        return cls(
            keycloak_user_id=keycloak_user_id,
            is_admin=False,
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
        )


class CreateOrUpdateUserFromKeycloakCommandHandler:
    @classmethod
    def handle(cls, command: CreateOrUpdateUserFromKeycloakCommand):
        existing_user = user_reader.get_user_linked_to_keycloak(command.keycloak_user_id)
        if existing_user is not None:
            cls._handle_existing_user(existing_user, command)
            return

        cls._handle_new_user(command)

    @classmethod
    def _handle_existing_user(cls, existing_user: User, command: CreateOrUpdateUserFromKeycloakCommand):
        user_data = UserData(
            email=command.email,
            username=command.username,
            first_name=command.first_name,
            last_name=command.last_name,
        )

        if existing_user.user_data == user_data:
            return

        user_data_updated_event_envelope = EventEnvelope(
            event=UserDataUpdatedEvent.from_user_data(existing_user.user_id, user_data, DateTime.now()),
            metadata=EventMetadata.without_creator(),
        )
        user_event_bus.record(user_data_updated_event_envelope)

        if existing_user.is_admin is True and command.is_admin is False:
            demote_admin_event_envelope = EventEnvelope(
                event=UserDemotedFromAdminEvent.new(existing_user.user_id, DateTime.now()),
                metadata=EventMetadata.without_creator(),
            )
            user_event_bus.record(demote_admin_event_envelope)

        if existing_user.is_admin is False and command.is_admin is True:
            promote_admin_event_envelope = EventEnvelope(
                UserPromotedToAdminEvent.new(existing_user.user_id, DateTime.now()),
                metadata=EventMetadata.without_creator(),
            )
            user_event_bus.record(promote_admin_event_envelope)

    @classmethod
    def _handle_new_user(cls, command: CreateOrUpdateUserFromKeycloakCommand):
        user_id = UserId.new()
        user_data = UserData(
            email=command.email,
            username=command.username,
            first_name=command.first_name,
            last_name=command.last_name,
        )
        user_created_event_envelope = EventEnvelope(
            event=UserCreatedEvent.from_user_data(user_id, user_data, DateTime.now()),
            metadata=EventMetadata.without_creator(),
        )
        user_event_bus.record(user_created_event_envelope)

        user_linked_to_keycloak_event_envelope = EventEnvelope(
            event=UserLinkedToKeycloakEvent.from_keycloak_user_id(user_id, command.keycloak_user_id, DateTime.now()),
            metadata=EventMetadata.without_creator(),
        )
        user_event_bus.record(user_linked_to_keycloak_event_envelope)

        if command.is_admin is True:
            user_promoted_to_admin_event_envelope = EventEnvelope(
                event=UserPromotedToAdminEvent.new(user_id, DateTime.now()),
                metadata=EventMetadata.without_creator(),
            )
            user_event_bus.record(user_promoted_to_admin_event_envelope)
