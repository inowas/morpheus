from flask import Response
from openapi_pydantic import OpenAPI
from openapi_pydantic.util import PydanticSchema, construct_open_api_with_schema_class

from ..write.messages import CreateModflowModelMessage, UpdateModflowModelMetadataMessage


class JsonSchemaRequestHandler:
    # noinspection PyMethodMayBeStatic
    def construct_base_open_api(self) -> OpenAPI:
        return OpenAPI.model_validate({
            'info': {
                'title': 'Morpheus API',
                'version': '0.1.0',
                'description': 'The Morpheus API is a RESTful API for the Morpheus application.',
                'contact': {
                    'name': 'Morpheus Team',
                    'url': '',
                    'email': '',
                },
            },
            'servers': [
                {
                    'url': 'http://localhost:5000',
                    'description': 'Local development server',
                },
            ],
            "paths": {
                '/healthcheck': {
                    'get': {
                        'summary': 'Healthcheck',
                        'description': 'Returns a simple OK response to check if the API is running.',
                        'responses': {
                            '200': {
                                'description': 'OK',
                            },
                        },
                    },
                },
                '/messagebox': {
                    'post': {
                        'summary': 'Send a message to the Morpheus application',
                        'description': 'Sends a message to the Morpheus application.',
                        'requestBody': {
                            'description': 'The Modflow model to create.',
                            'content': {
                                'application/json': {
                                    'schema': {
                                        'anyOf': [
                                            PydanticSchema(schema_class=CreateModflowModelMessage),
                                            PydanticSchema(schema_class=UpdateModflowModelMetadataMessage),
                                        ]
                                    }
                                },
                            },
                            'required': True,
                        },
                        'responses': {
                            '201': {
                                'description': 'Created',
                                'headers': {
                                    'Location': {
                                        'description': 'The URL of the created Modflow model.',
                                        'schema': {
                                            'type': 'string',
                                        },
                                    },
                                },
                            },
                            '400': {
                                'description': 'Bad request',
                                'content': {
                                    'application/json': {
                                        'schema': {

                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

    def handle(self):
        open_api = self.construct_base_open_api()
        open_api = construct_open_api_with_schema_class(open_api)

        return Response(
            response=open_api.model_dump_json(by_alias=True, exclude_none=True, indent=2),
            status=200,
            mimetype='application/json'
        )
