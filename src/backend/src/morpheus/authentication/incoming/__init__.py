from morpheus.user.outgoing import create_or_update_user_from_keycloak as create_or_update_user_from_keycloak_outgoing

def create_or_update_user_from_keycloak(
    keycloak_user_id: str,
    is_admin: bool,
    email: str,
    username: str,
    first_name: str | None,
    last_name: str | None
) -> None:
    create_or_update_user_from_keycloak_outgoing(keycloak_user_id, is_admin, email, username, first_name, last_name)
