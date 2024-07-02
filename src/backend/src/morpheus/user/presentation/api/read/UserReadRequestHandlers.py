import dataclasses
from typing import Literal

from morpheus.user.application.read.UserReader import user_reader
from morpheus.user.incoming import get_identity
from morpheus.user.types.User import User


@dataclasses.dataclass(frozen=True)
class UserResponseObject:
    user: User

    @staticmethod
    def from_user(user: User):
        return UserResponseObject(user=user)

    def serialize(self, target: Literal['admin', 'user'] = 'user'):
        if target == 'admin':
            return {
                'user_id': self.user.user_id.to_str(),
                'is_admin': self.user.is_admin,
                'email': self.user.user_data.email.to_str(),
                'username': self.user.user_data.username.to_str(),
                'first_name': self.user.user_data.first_name.to_str() if self.user.user_data.first_name is not None else None,
                'last_name': self.user.user_data.last_name.to_str() if self.user.user_data.last_name is not None else None,
                'keycloak_user_id': self.user.keycloak_user_id.to_str() if self.user.keycloak_user_id is not None else None,
                'geo_node_user_id': self.user.geo_node_user_id.to_int() if self.user.geo_node_user_id is not None else None,
            }

        return {
            'user_id': self.user.user_id.to_str(),
            'username': self.user.user_data.username.to_str(),
            'first_name': self.user.user_data.first_name.to_str() if self.user.user_data.first_name is not None else None,
            'last_name': self.user.user_data.last_name.to_str() if self.user.user_data.last_name is not None else None,
        }


class ReadUserListRequestHandler:
    @staticmethod
    def handle():
        identity = get_identity()
        if identity is None:
            return '', 401

        target: Literal['admin', 'user'] = 'user' if not identity.is_admin else 'admin'

        users = user_reader.get_all_users()
        result = [UserResponseObject.from_user(user).serialize(target=target) for user in users]
        return result, 200


class ReadAuthenticatedUserRequestHandler:
    @staticmethod
    def handle():
        identity = get_identity()
        if identity is None:
            return '', 401

        user = user_reader.get_user_by_id(identity.user_id)
        if user is None:
            raise Exception('User not found')

        return UserResponseObject.from_user(user).serialize(), 200
