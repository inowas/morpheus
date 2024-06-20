import dataclasses
from enum import StrEnum

from morpheus.common.infrastructure.event_sourcing.EventFactory import EventFactory, EventRegistry
from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.user.types.User import UserId, GeoNodeUserId, KeycloakUserId, UserData


class UserEventName(StrEnum):
    USER_CREATED = 'User Created'
    USER_DATA_UPDATED = 'User Data Updated'
    USER_LINKED_TO_KEYCLOAK = 'User Linked to Keycloak'
    USER_LINKED_TO_GEO_NODE = 'User Linked to GeoNode'
    USER_PROMOTED_TO_ADMIN = 'User Promoted to Admin'
    USER_DEMOTED_FROM_ADMIN = 'User Demoted from Admin'


@dataclasses.dataclass(frozen=True)
class UserEventBase(EventBase):
    def get_user_id(self) -> UserId:
        return UserId.from_str(self.entity_uuid.to_str())


@dataclasses.dataclass(frozen=True)
class UserCreatedEvent(UserEventBase):
    @classmethod
    def from_user_data(cls, user_id: UserId, user_data: UserData, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(user_id.to_str()),
            occurred_at=occurred_at,
            payload=user_data.to_dict()
        )

    def get_user_data(self) -> UserData:
        return UserData.from_dict(self.payload)

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(UserEventName.USER_CREATED)


@dataclasses.dataclass(frozen=True)
class UserDataUpdatedEvent(UserEventBase):
    @classmethod
    def from_user_data(cls, user_id: UserId, user_data: UserData, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(user_id.to_str()),
            occurred_at=occurred_at,
            payload=user_data.to_dict(),
        )

    def get_user_data(self) -> UserData:
        return UserData.from_dict(self.payload)

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(UserEventName.USER_DATA_UPDATED)


@dataclasses.dataclass(frozen=True)
class UserLinkedToKeycloakEvent(UserEventBase):
    @classmethod
    def from_keycloak_user_id(cls, user_id: UserId, keycloak_user_id: KeycloakUserId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(user_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'keycloak_user_id': keycloak_user_id.to_str()
            }
        )

    def get_keycloak_user_id(self) -> KeycloakUserId:
        return KeycloakUserId.from_str(self.payload['keycloak_user_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(UserEventName.USER_LINKED_TO_KEYCLOAK)


@dataclasses.dataclass(frozen=True)
class UserLinkedToGeonodeEvent(UserEventBase):
    @classmethod
    def from_geonode_user_id(cls, user_id: UserId, geo_node_user_id: GeoNodeUserId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(user_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'geo_node_user_id': geo_node_user_id.to_int(),
            }
        )

    def get_geo_node_user_id(self) -> GeoNodeUserId:
        return GeoNodeUserId.from_int(self.payload['geo_node_user_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(UserEventName.USER_LINKED_TO_GEO_NODE)


@dataclasses.dataclass(frozen=True)
class UserPromotedToAdminEvent(UserEventBase):
    @classmethod
    def new(cls, user_id: UserId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(user_id.to_str()),
            occurred_at=occurred_at,
            payload={}
        )

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(UserEventName.USER_PROMOTED_TO_ADMIN)


@dataclasses.dataclass(frozen=True)
class UserDemotedFromAdminEvent(UserEventBase):
    @classmethod
    def new(cls, user_id: UserId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(user_id.to_str()),
            occurred_at=occurred_at,
            payload={}
        )

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(UserEventName.USER_DEMOTED_FROM_ADMIN)


user_event_registry = EventRegistry()
user_event_registry.register_event(UserCreatedEvent)
user_event_registry.register_event(UserDataUpdatedEvent)
user_event_registry.register_event(UserLinkedToKeycloakEvent)
user_event_registry.register_event(UserLinkedToGeonodeEvent)
user_event_registry.register_event(UserPromotedToAdminEvent)
user_event_registry.register_event(UserDemotedFromAdminEvent)

user_event_factory = EventFactory(user_event_registry)
