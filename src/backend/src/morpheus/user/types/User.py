import dataclasses

from morpheus.common.types import Uuid, Integer
from morpheus.common.types.String import NonEmptyString


@dataclasses.dataclass(frozen=True)
class UserId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class KeycloakUserId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class GeoNodeUserId(Integer):
    def __post_init__(self):
        if self.value <= 0:
            raise ValueError('GeoNode user id must be greater zero')


@dataclasses.dataclass(frozen=True)
class Username(NonEmptyString):
    pass


@dataclasses.dataclass(frozen=True)
class UserEmail(NonEmptyString):
    pass


@dataclasses.dataclass(frozen=True)
class UserFirstName(NonEmptyString):
    pass


@dataclasses.dataclass(frozen=True)
class UserLastName(NonEmptyString):
    pass


@dataclasses.dataclass(frozen=True)
class UserData:
    email: UserEmail
    username: Username
    first_name: UserFirstName | None
    last_name: UserLastName | None

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            email=UserEmail.from_str(obj['email']),
            username=Username.from_str(obj['username']),
            first_name=UserFirstName.from_str(obj['first_name']) if obj['first_name'] else None,
            last_name=UserLastName.from_str(obj['last_name']) if obj['last_name'] else None,
        )

    def to_dict(self):
        return {
            'email': self.email.to_str(),
            'username': self.username.to_str(),
            'first_name': self.first_name.to_str() if self.first_name else None,
            'last_name': self.last_name.to_str() if self.last_name else None,
        }

    def __eq__(self, other):
        if not isinstance(other, UserData):
            return False

        return self.email == other.email and self.username == other.username and self.first_name == other.first_name and self.last_name == other.last_name


@dataclasses.dataclass(frozen=True)
class User:
    user_id: UserId
    keycloak_user_id: KeycloakUserId | None
    geo_node_user_id: GeoNodeUserId | None
    is_admin: bool
    user_data: UserData

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            user_id=UserId.from_str(obj['user_id']),
            keycloak_user_id=KeycloakUserId.from_str(obj['keycloak_user_id']) if obj['keycloak_user_id'] else None,
            geo_node_user_id=GeoNodeUserId(obj['geo_node_user_id']) if obj['geo_node_user_id'] else None,
            is_admin=True if obj['is_admin'] is True else False,
            user_data=UserData.from_dict(obj),
        )

    def to_dict(self):
        return {
            'user_id': self.user_id.to_str(),
            'keycloak_user_id': self.keycloak_user_id.to_str() if self.keycloak_user_id else None,
            'geo_node_user_id': self.geo_node_user_id.value if self.geo_node_user_id else None,
            'is_admin': self.is_admin,
            'user_data': self.user_data.to_dict(),
        }
