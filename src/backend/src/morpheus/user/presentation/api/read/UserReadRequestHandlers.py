import dataclasses

from morpheus.user.application.read.UserReader import user_reader
from morpheus.user.incoming import get_identity
from morpheus.user.types.User import User


@dataclasses.dataclass(frozen=True)
class UserResponseObject:
    user: User

    @staticmethod
    def from_user(user: User):
        return UserResponseObject(user=user)

    def serialize(self) -> dict:
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


class ReadUserListRequestHandler:
    @staticmethod
    def handle():
        identity = get_identity()
        if identity is None:
            return '', 401

        if not identity.is_admin:
            return '', 403

        users = user_reader.get_all_users()

        result = []
        for user in users:
            result.append(UserResponseObject.from_user(user).serialize())

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
