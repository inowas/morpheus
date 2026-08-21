import json
import os

from fastapi import FastAPI
from fastapi.responses import JSONResponse, PlainTextResponse

from morpheus.settings import settings

app = FastAPI(docs_url=None, openapi_url=None, redoc_url=None)


@app.get('/healthcheck', response_class=PlainTextResponse)
def healthcheck():
    return 'OK'


@app.get('/schema')
def read_schema():
    if not os.path.exists(settings.OPENAPI_BUNDLED_SPEC_FILE):
        return JSONResponse({'error': 'No schema available, Please run "make build-openapi-spec" first.'}, status_code=404)

    with open(settings.OPENAPI_BUNDLED_SPEC_FILE) as file:
        return json.load(file)
