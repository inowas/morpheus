import functools

import flask
from openapi_core import OpenAPI
from openapi_core.contrib.flask import FlaskOpenAPIRequest
from openapi_core.exceptions import OpenAPIError

from morpheus.settings import settings


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


def validate_request(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        openapi_request = FlaskOpenAPIRequest(flask.request)
        openapi = OpenAPI.from_file_path(settings.OPENAPI_BUNDLED_SPEC_FILE)

        openapi.validate_request(openapi_request)
        
        return f(*args, **kwargs)

    return decorated_function
