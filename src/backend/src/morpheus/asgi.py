import json
import os

from fastapi import FastAPI
from fastapi.responses import JSONResponse, PlainTextResponse

from morpheus.project.router import router as project_router
from morpheus.sensor.router import router as sensor_router
from morpheus.settings import settings
from morpheus.user.router import router as user_router

app = FastAPI(docs_url=None, openapi_url=None, redoc_url=None)
app.include_router(project_router)
app.include_router(sensor_router)
app.include_router(user_router)


@app.get('/healthcheck', response_class=PlainTextResponse)
def healthcheck():
    return 'OK'


@app.get('/schema')
def read_schema():
    if not os.path.exists(settings.OPENAPI_BUNDLED_SPEC_FILE):
        return JSONResponse({'error': 'No schema available, Please run "make build-openapi-spec" first.'}, status_code=404)

    with open(settings.OPENAPI_BUNDLED_SPEC_FILE) as file:
        return json.load(file)
