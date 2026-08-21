from unittest.mock import patch

import pytest
from flask import Flask, request
from openapi_core.contrib.flask import FlaskOpenAPIRequest
from openapi_core.exceptions import OpenAPIError

from morpheus.common.presentation.api.middleware.schema_validation import SchemaValidationException, validate_request_against_schema


def test_validate_request_against_schema_delegates_to_openapi():
    app = Flask(__name__)
    with app.test_request_context('/users/groups', method='POST', json={'name': 'test'}):
        openapi_request = FlaskOpenAPIRequest(request)
        with patch('morpheus.common.presentation.api.middleware.schema_validation.OpenAPI.validate_request') as validate:
            validate_request_against_schema(openapi_request)

        validate.assert_called_once_with(openapi_request)


def test_validate_request_against_schema_wraps_openapi_errors():
    app = Flask(__name__)
    with app.test_request_context('/users/groups', method='POST', json={}):
        openapi_request = FlaskOpenAPIRequest(request)
        with patch(
            'morpheus.common.presentation.api.middleware.schema_validation.OpenAPI.validate_request',
            side_effect=OpenAPIError('invalid'),
        ), pytest.raises(SchemaValidationException):
            validate_request_against_schema(openapi_request)
