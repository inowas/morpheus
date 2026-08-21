import functools
from collections.abc import Callable
from contextvars import ContextVar

from flask import request

from morpheus.authentication.incoming import create_or_update_user_from_keycloak, get_identity_by_keycloak_id
from morpheus.authentication.infrastructure import keycloak_openid_provider
from morpheus.authentication.infrastructure.bearer_token import extract_bearer_token_from
from morpheus.settings import settings

identity_context: ContextVar[dict | None] = ContextVar('identity_context', default=None)


def authenticate(requires_logged_in_user: bool = True):
    def decorator(route_handler: Callable):
        @functools.wraps(route_handler)
        def decorated_function(*args, **kwargs):
            context_token = identity_context.set(None)
            try:
                token = extract_bearer_token_from(request)

                if token is None:
                    if requires_logged_in_user:
                        return 'Unauthorized', 401

                    return route_handler(*args, **kwargs)

                keycloak_user_data = keycloak_openid_provider.parse_user_data_from_token(token)
                if keycloak_user_data is None:
                    return 'Unauthorized', 401

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
                return route_handler(*args, **kwargs)
            finally:
                identity_context.reset(context_token)

        return decorated_function

    return decorator


def get_identity() -> dict | None:
    return identity_context.get()
