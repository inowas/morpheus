from typing import Any

ResponseDefinitions = dict[int | str, dict[str, Any]]


AUTH_RESPONSES: ResponseDefinitions = {
    401: {'description': 'The request lacks valid authentication'},
    403: {'description': 'Missing or insufficient permissions to perform the request'},
}

NOT_FOUND_RESPONSES: ResponseDefinitions = {
    **AUTH_RESPONSES,
    404: {'description': 'The requested resource could not be found'},
}

FULL_READ_RESPONSES: ResponseDefinitions = {
    **NOT_FOUND_RESPONSES,
    500: {'description': 'Internal Server Error'},
}

PROJECT_LIST_RESPONSES: ResponseDefinitions = {
    **AUTH_RESPONSES,
    404: {'description': 'The requested resource could not be found'},
}

ASSET_LIST_RESPONSES: ResponseDefinitions = {
    **AUTH_RESPONSES,
    500: {'description': 'Internal Server Error'},
}

ASSET_DETAIL_RESPONSES: ResponseDefinitions = FULL_READ_RESPONSES

DOWNLOAD_RESPONSES: ResponseDefinitions = {
    **NOT_FOUND_RESPONSES,
}

PUBLIC_PREVIEW_RESPONSES: ResponseDefinitions = {
    **NOT_FOUND_RESPONSES,
}

NO_CONTENT_RESPONSES: ResponseDefinitions = {
    **AUTH_RESPONSES,
    500: {'description': 'Internal Server Error'},
}

UPLOAD_RESPONSES: ResponseDefinitions = {
    **AUTH_RESPONSES,
    413: {'description': 'The uploaded file is too large'},
    415: {'description': 'The media type of the request is not supported'},
    422: {'description': 'The request body was not well formed or the content was invalid'},
    500: {'description': 'Internal Server Error'},
}
