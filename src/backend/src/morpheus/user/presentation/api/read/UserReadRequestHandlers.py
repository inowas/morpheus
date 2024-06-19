

from morpheus.authentication.outgoing import get_logged_in_user_id
from morpheus.user.application.read.UserReader import user_reader
from morpheus.user.incoming import get_identity


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
            result.append({
                'user_id': user.user_id.to_str(),
                'is_admin': user.is_admin,
                'email': user.user_data.email.to_str(),
                'username': user.user_data.username.to_str(),
                'first_name': user.user_data.first_name.to_str() if user.user_data.first_name is not None else None,
                'last_name': user.user_data.last_name.to_str() if user.user_data.last_name is not None else None,
                'keycloak_user_id': user.keycloak_user_id.to_str() if user.keycloak_user_id is not None else None,
                'geo_node_user_id': user.geo_node_user_id.to_str() if user.geo_node_user_id is not None else None,
            })

        return result, 200
