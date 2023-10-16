from typing import Callable
from flask import request

from morpheus.authentication.infrastructure.bearer_token import extract_bearer_token_from
from morpheus.authentication.infrastructure.keycloak_openid_provider import is_token_valid


def require_logged_in_user(route_handler: Callable):
    def wrapper():
        token = extract_bearer_token_from(request)
        if (token is None):
            return 'Unauthorized', 401

        if (not is_token_valid(token)):
            return 'Unauthorized', 401

        return route_handler()

    return wrapper
