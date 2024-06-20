import os
import json
import traceback

from flask import Flask, jsonify
from flask_cors import cross_origin
from werkzeug.exceptions import HTTPException
from werkzeug import Response
from morpheus.common.presentation.api.middleware.schema_validation import SchemaValidationException, parse_schema_file
from morpheus.settings import settings
from morpheus.project.bootstrap import bootstrap_project_module
from morpheus.sensor.bootstrap import bootstrap_sensor_module
from morpheus.user.bootstrap import bootstrap_user_module


def bootstrap(app: Flask):
    bootstrap_project_module(app)
    bootstrap_sensor_module(app)
    bootstrap_user_module(app)

    @app.route('/schema', methods=['GET'])
    @cross_origin()
    def read_schema():
        if not os.path.exists(settings.OPENAPI_BUNDLED_SPEC_FILE):
            return json.dumps({'error': 'No schema available, Please run "make build-openapi-spec" first.'}), 404

        with open(settings.OPENAPI_BUNDLED_SPEC_FILE) as file:
            data = json.load(file)
            return jsonify(data), 200

    @app.cli.command('check-schema')
    def check_schema_file():
        print('\n\x1b[1;32;40m' + 'Checking schema file...' + '\x1b[0m' + '\n')
        parse_schema_file()
        print('\x1b[6;30;42m' + 'Success!... Schema is valid and can be parsed by the system.' + '\x1b[0m' + '\n\n\n')

    @app.errorhandler(SchemaValidationException)
    def handle_schema_validation_exception(exception: SchemaValidationException):
        # todo: logging, sentry, ...
        if not settings.is_production():
            app.logger.exception(exception.get_previous_exception())
        response = Response(status=422)
        response.content_type = 'application/json'
        response.data = json.dumps({'errors': exception.get_errors()})
        return response

    @app.errorhandler(HTTPException)
    def handle_http_exceptions(exception):
        response = exception.get_response()
        if response.is_json:
            return response

        response.data = json.dumps({
            'code': exception.code,
            'name': exception.name,
            'description': exception.description,
        })
        response.content_type = 'application/json'
        return response

    @app.errorhandler(Exception)
    def handle_internal_server_error(exception: Exception):
        if isinstance(exception, HTTPException):
            raise exception

        if isinstance(exception, SchemaValidationException):
            raise exception

        # todo: logging, sentry, ...
        app.logger.exception(exception)

        response = Response(status=500)
        response.content_type = 'application/json'

        if not settings.is_production():
            response.data = json.dumps({'error': traceback.format_exc()})

        return response

    app.json.sort_keys = False  # type: ignore
    app.json.indent = 4  # type: ignore
    app.add_url_rule('/healthcheck', 'healthcheck', lambda: 'OK', methods=['GET'])
