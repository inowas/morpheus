import functools
from typing import Callable
from flask import request, g as request_global_context

from morpheus.authentication.infrastructure import keycloak_openid_provider
from morpheus.authentication.infrastructure.bearer_token import extract_bearer_token_from


def authenticate(requires_logged_in_user: bool = True):
    def decorator(route_handler: Callable):
        @functools.wraps(route_handler)
        def decorated_function(*args, **kwargs):
            token = extract_bearer_token_from(request)

            if token is None:
                if requires_logged_in_user:
                    return 'Unauthorized', 401

                request_global_context.user_id = None
                return route_handler(*args, **kwargs)

            if token is not None:
                user_id = keycloak_openid_provider.get_user_id_from_token(token)
                if user_id is None:
                    return 'Unauthorized', 401

                request_global_context.user_id = user_id
                return route_handler(*args, **kwargs)

        return decorated_function

    return decorator


def get_logged_in_user_id() -> str | None:
    return request_global_context.get('user_id', None)
