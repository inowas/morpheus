from contextvars import ContextVar

from morpheus.authentication.incoming import create_or_update_user_from_keycloak, get_identity_by_keycloak_id
from morpheus.authentication.infrastructure import keycloak_openid_provider
from morpheus.settings import settings

identity_context: ContextVar[dict | None] = ContextVar('identity_context', default=None)


def authenticate_token(token: str) -> bool:
    keycloak_user_data = keycloak_openid_provider.parse_user_data_from_token(token)
    if keycloak_user_data is None:
        return False

    create_or_update_user_from_keycloak(
        keycloak_user_data.user_id,
        settings.KEYCLOAK_MORPHEUS_ADMIN_ROLE in keycloak_user_data.roles,
        keycloak_user_data.email,
        keycloak_user_data.username,
        keycloak_user_data.first_name,
        keycloak_user_data.last_name,
    )
    identity = get_identity_by_keycloak_id(keycloak_user_data.user_id)
    identity_context.set(identity.to_dict() if identity is not None else None)
    return True


def get_identity() -> dict | None:
    return identity_context.get()
