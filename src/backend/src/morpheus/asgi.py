from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from morpheus.project.asset_router import router as asset_router
from morpheus.project.calculation_router import router as calculation_router
from morpheus.project.model_router import router as model_router
from morpheus.project.router import router as project_router
from morpheus.sensor.router import router as sensor_router
from morpheus.user.router import router as user_router

app = FastAPI(docs_url=None, openapi_url='/schema', redoc_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*'],
)
app.include_router(project_router)
app.include_router(model_router)
app.include_router(calculation_router)
app.include_router(asset_router)
app.include_router(sensor_router)
app.include_router(user_router)


@app.get('/healthcheck', response_class=PlainTextResponse, operation_id='healthcheck', responses={200: {'description': 'API is healthy'}})
def healthcheck():
    return 'OK'
