import dataclasses
from typing import Mapping, Any
import pymongo
from pymongo.collection import Collection
from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.common.types.identity.Identity import UserId
from morpheus.settings import settings as app_settings
from ...types.User import KeycloakUserId, User, GeoNodeUserId, UserData


@dataclasses.dataclass(frozen=True)
class UserRepositoryDocument:
    user_id: str
    keycloak_user_id: str | None
    geo_node_user_id: int | None
    is_admin: bool
    user_data: dict

    @classmethod
    def from_user(cls, user: User):
        return cls(
            user_id=user.user_id.to_str(),
            keycloak_user_id=user.keycloak_user_id.to_str() if user.keycloak_user_id is not None else None,
            geo_node_user_id=user.geo_node_user_id.to_int() if user.geo_node_user_id is not None else None,
            is_admin=user.is_admin,
            user_data=user.user_data.to_dict(),
        )

    @classmethod
    def from_raw_document(cls, raw_document: Mapping[str, Any]):
        return cls(
            user_id=raw_document['user_id'],
            keycloak_user_id=raw_document['keycloak_user_id'] if 'keycloak_user_id' in raw_document else None,
            geo_node_user_id=raw_document['geo_node_user_id'] if 'geo_node_user_id' in raw_document else None,
            is_admin=True if 'is_admin' in raw_document and raw_document['is_admin'] is True else False,
            user_data=raw_document['user_data'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_user(self) -> User:
        return User(
            user_id=UserId.from_str(self.user_id),
            keycloak_user_id=KeycloakUserId.try_from_str(self.keycloak_user_id),
            geo_node_user_id=GeoNodeUserId.try_from_int(self.geo_node_user_id),
            is_admin=self.is_admin,
            user_data=UserData.from_dict(self.user_data),
        )


class UserRepository(RepositoryBase):
    def get_user_by_keycloak_id(self, keycloak_user_id: KeycloakUserId) -> User | None:
        raw_document = self.collection.find_one({'keycloak_user_id': keycloak_user_id.to_str()}, {'_id': 0})
        if raw_document is None:
            return None

        return UserRepositoryDocument.from_raw_document(raw_document).get_user()

    def add_user(self, user: User) -> None:
        self.collection.insert_one(UserRepositoryDocument.from_user(user).to_dict())

    def update_user_data(self, user_id: UserId, user_data: UserData) -> None:
        self.collection.update_one(
            filter={'user_id': user_id.to_str()},
            update={'$set': {'user_data': user_data.to_dict()}}
        )

    def set_keycloak_id_for_user(self, user_id: UserId, keycloak_user_id: KeycloakUserId) -> None:
        self.collection.update_one(
            filter={'user_id': user_id.to_str()},
            update={'$set': {'keycloak_user_id': keycloak_user_id.to_str()}}
        )

    def set_admin_flag_for_user(self, user_id: UserId, is_admin: bool) -> None:
        self.collection.update_one(
            filter={'user_id': user_id.to_str()},
            update={'$set': {'is_admin': is_admin}}
        )

    def find_all_users(self) -> list[User]:
        return [UserRepositoryDocument.from_raw_document(raw_document).get_user() for raw_document in self.collection.find({}, {'_id': 0})]


def __create_indices_for_repository(collection: Collection):
    collection.create_index(
        [
            ('user_id', pymongo.ASCENDING),
        ],
        unique=True,
    )
    collection.create_index(
        [
            ('user_data.email', pymongo.ASCENDING),
        ],
        unique=True,
    )
    collection.create_index(
        [
            ('user_data.username', pymongo.ASCENDING),
        ],
        unique=True,
    )
    collection.create_index(
        [
            ('keycloak_user_id', pymongo.ASCENDING),
        ],
        unique=True,
        partialFilterExpression={'geo_node_user_id': {'$type': 'string'}}
    )
    collection.create_index(
        [
            ('geo_node_user_id', pymongo.ASCENDING),
        ],
        unique=True,
        partialFilterExpression={'geo_node_user_id': {'$type': 'number'}}
    )


user_repository = UserRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_USER_DATABASE, create_if_not_exist=True),
        'users',
        __create_indices_for_repository
    )
)
