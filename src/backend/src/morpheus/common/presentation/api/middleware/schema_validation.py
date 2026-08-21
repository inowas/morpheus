import functools
from collections.abc import Hashable
from typing import Any, cast

import flask
from openapi_core import OpenAPI
from openapi_core.contrib.flask import FlaskOpenAPIRequest
from openapi_core.exceptions import OpenAPIError


class SchemaValidationException(Exception):
    def __init__(self, message, errors, previous_exception=None):
        super().__init__(message)
        self.errors = errors
        self.previous_exception = previous_exception

    def get_errors(self):
        return self.errors

    def get_previous_exception(self):
        return self.previous_exception

    def __str__(self):
        return str(self.errors)


def validate_request_against_schema(openapi_request) -> None:
    from morpheus.asgi import app

    openapi = OpenAPI.from_dict(cast(dict[Hashable, Any], app.openapi()))

    try:
        openapi.validate_request(openapi_request)
    except OpenAPIError as open_api_error:
        raise SchemaValidationException(
            'Schema Validation Error:',
            [str(open_api_error)],
            open_api_error,
        ) from open_api_error


def validate_request(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        validate_request_against_schema(FlaskOpenAPIRequest(flask.request))
        return f(*args, **kwargs)

    return decorated_function
