from morpheus.common.types.identity.Identity import Identity
from morpheus.user.outgoing import create_or_update_user_from_keycloak as create_or_update_user_from_keycloak_outgoing
from morpheus.user.outgoing import get_identity_by_keycloak_id as get_identity_by_keycloak_id_outgoing


def create_or_update_user_from_keycloak(
    keycloak_user_id: str,
    is_admin: bool,
    email: str,
    username: str,
    first_name: str | None,
    last_name: str | None
):
    create_or_update_user_from_keycloak_outgoing(keycloak_user_id, is_admin, email, username, first_name, last_name)


def get_identity_by_keycloak_id(keycloak_user_id: str) -> Identity | None:
    identity = get_identity_by_keycloak_id_outgoing(keycloak_user_id)
    if identity is None:
        return None

    return Identity.from_dict(identity)
