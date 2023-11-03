import os

from flask import Request
from openapi_core import Spec, V31RequestValidator
from openapi_core.contrib.flask import FlaskOpenAPIRequest

openapi_spec_file = os.path.join(os.path.dirname(os.path.realpath(__file__)), "../../../../schema/openapi.yaml")


class SchemaValidationException(Exception):
    def __init__(self, message, errors):
        super().__init__(message)
        self.errors = errors

    def get_errors(self):
        return self.errors

    def __str__(self):
        return str(self.errors)


def validate_request(req: Request):
    try:
        spec = Spec.from_file_path(openapi_spec_file)
        openapi_request = FlaskOpenAPIRequest(req)
        errors = [str(error) for error in list(V31RequestValidator(spec).iter_errors(openapi_request))]
        if len(errors) > 0:
            raise SchemaValidationException('Schema Validation Error:', errors)
        return errors
    except Exception as e:
        raise SchemaValidationException('Invalid request', str(e))
