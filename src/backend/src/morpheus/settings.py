import os
from dynaconf import Dynaconf, Validator


class Settings:
    def __init__(self, env: str, values):
        valid_environments = ['production', 'development', 'testing']
        if env not in valid_environments:
            raise ValueError(f"environment must be one of {valid_environments}")

        self.ENV: str = env
        self.SECRET_KEY: str = values.SECRET_KEY
        self.MAX_CONTENT_LENGTH: int = int(values.MAX_CONTENT_LENGTH)
        self.KEYCLOAK_CLIENT_ID = values.KEYCLOAK_CLIENT_ID
        self.KEYCLOAK_CLIENT_SECRET = values.KEYCLOAK_CLIENT_SECRET
        self.KEYCLOAK_REALM: str = values.KEYCLOAK_REALM
        self.KEYCLOAK_SERVER_URL: str = values.KEYCLOAK_SERVER_URL
        self.KEYCLOAK_MORPHEUS_ADMIN_ROLE: str = values.KEYCLOAK_MORPHEUS_ADMIN_ROLE
        self.MONGO_HOST: str = values.MONGO_HOST
        self.MONGO_PORT: int = int(values.MONGO_PORT)
        self.MONGO_USER: str = values.MONGO_USER
        self.MONGO_PASSWORD: str = values.MONGO_PASSWORD
        self.MONGO_PROJECT_DATABASE: str = 'project_data'
        self.MONGO_SENSOR_DATABASE: str = 'sensor_data'
        self.MONGO_USER_DATABASE: str = 'user_data'
        self.MORPHEUS_PROJECT_ASSET_DATA: str = values.MORPHEUS_PROJECT_ASSET_DATA
        self.MORPHEUS_PROJECT_CALCULATION_DATA: str = values.MORPHEUS_PROJECT_CALCULATION_DATA
        self.MORPHEUS_PROJECT_PREVIEW_IMAGE_DIMENSIONS: tuple[int, int] = (100, 100)
        self.MORPHEUS_SENSORS_UIT_FTP_HOST: str = values.MORPHEUS_SENSORS_UIT_FTP_HOST
        self.MORPHEUS_SENSORS_UIT_FTP_USER: str = values.MORPHEUS_SENSORS_UIT_FTP_USER
        self.MORPHEUS_SENSORS_UIT_FTP_PASSWORD: str = values.MORPHEUS_SENSORS_UIT_FTP_PASSWORD
        self.MORPHEUS_SENSORS_UIT_FTP_PATH: str = values.MORPHEUS_SENSORS_UIT_FTP_PATH
        self.MORPHEUS_SENSOR_LOCAL_DATA: str = values.MORPHEUS_SENSOR_LOCAL_DATA
        self.OPENAPI_BUNDLED_SPEC_FILE: str = os.path.abspath(os.path.join(os.path.dirname(__file__), 'openapi.bundle.json'))
        self.CELERY_BROKER = values.CELERY_BROKER
        self.CELERY_RESULT_BACKEND = values.CELERY_RESULT_BACKEND
        self.CELERY_INCLUDE_TASK_MODULES = ['morpheus.project.tasks']

    @classmethod
    def from_dynaconf(cls, dynaconf: Dynaconf):
        return cls(str(dynaconf.current_env), dynaconf)

    def __getitem__(self, key):
        return getattr(self, key)

    def is_production(self):
        return self.ENV == 'production'


settings = Settings.from_dynaconf(
    Dynaconf(
        load_dotenv=True,
        environments=True,
        envvar_prefix='BACKEND',
        env=os.environ.get('FLASK_ENV', 'production'),
        validators=[
            Validator('SECRET_KEY', must_exist=True),
            Validator('MAX_CONTENT_LENGTH', must_exist=True),
            Validator('KEYCLOAK_CLIENT_ID', must_exist=True),
            Validator('KEYCLOAK_CLIENT_SECRET', must_exist=True),
            Validator('KEYCLOAK_REALM', must_exist=True),
            Validator('KEYCLOAK_SERVER_URL', must_exist=True),
            Validator('KEYCLOAK_MORPHEUS_ADMIN_ROLE', default='morpheus_admin'),
            Validator('MONGO_HOST', must_exist=True),
            Validator('MONGO_PORT', must_exist=True),
            Validator('MONGO_USER', must_exist=True),
            Validator('MONGO_PASSWORD', must_exist=True),
            Validator('MORPHEUS_PROJECT_ASSET_DATA', default='/mnt/project/assets'),
            Validator('MORPHEUS_PROJECT_CALCULATION_DATA', default='/mnt/project/calculations'),
            Validator('MORPHEUS_SENSOR_LOCAL_DATA', default='/mnt/sensors'),
            Validator('MORPHEUS_SENSORS_UIT_FTP_HOST', must_exist=True),
            Validator('MORPHEUS_SENSORS_UIT_FTP_USER', must_exist=True),
            Validator('MORPHEUS_SENSORS_UIT_FTP_PASSWORD', must_exist=True),
            Validator('MORPHEUS_SENSORS_UIT_FTP_PATH', must_exist=True),
        ]
    )
)
