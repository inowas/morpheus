import traceback

from flask import Flask, json
from werkzeug.exceptions import HTTPException
from werkzeug import Response

from morpheus.settings import settings
from morpheus.modflow import bootstrap_modflow_module
from morpheus.sensors import bootstrap_sensors_module


def bootstrap(app: Flask):
    bootstrap_modflow_module(app)
    bootstrap_sensors_module(app)

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
    def handle_internal_server_error(exception):
        if isinstance(exception, HTTPException):
            return exception

        # todo: logging, sentry, ...
        app.logger.exception(exception)

        response = Response(status=500)
        response.content_type = 'application/json'

        if not settings.is_production():
            response.data = json.dumps({'error': traceback.format_exc()})

        return response

    app.json.sort_keys = False  # type: ignore
    app.add_url_rule('/healthcheck', 'healthcheck', lambda: 'OK', methods=['GET'])
