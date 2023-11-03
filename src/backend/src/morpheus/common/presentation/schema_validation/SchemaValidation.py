import functools

import flask
from openapi_core import Spec, V31RequestValidator
from openapi_core.contrib.flask import FlaskOpenAPIRequest

from morpheus.settings import settings


class SchemaValidationException(Exception):
    def __init__(self, message, errors):
        super().__init__(message)
        self.errors = errors

    def get_errors(self):
        return self.errors

    def __str__(self):
        return str(self.errors)


def validate_request(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            spec = Spec.from_file_path(settings.OPENAPI_LOCAL_SPEC_FILE)
            openapi_request = FlaskOpenAPIRequest(flask.request)
            errors = [str(error) for error in list(V31RequestValidator(spec).iter_errors(openapi_request))]
            if len(errors) == 0:
                return f(*args, **kwargs)

            raise SchemaValidationException('Schema Validation Error:', errors)
        except Exception as e:
            raise SchemaValidationException('Invalid request', str(e))

    return decorated_function
