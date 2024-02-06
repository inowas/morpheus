import os
from dynaconf import Dynaconf, Validator


class Settings:
    def __init__(self, env: str, values):
        valid_environments = ['production', 'development', 'testing']
        if env not in valid_environments:
            raise ValueError(f"environment must be one of {valid_environments}")

        self.ENV: str = env
        self.SECRET_KEY: str = values.SECRET_KEY
        self.KEYCLOAK_CLIENT_ID = values.KEYCLOAK_CLIENT_ID
        self.KEYCLOAK_CLIENT_SECRET = values.KEYCLOAK_CLIENT_SECRET
        self.KEYCLOAK_REALM: str = values.KEYCLOAK_REALM
        self.KEYCLOAK_SERVER_URL: str = values.KEYCLOAK_SERVER_URL
        self.MONGO_HOST: str = values.MONGO_HOST
        self.MONGO_PORT: int = int(values.MONGO_PORT)
        self.MONGO_USER: str = values.MONGO_USER
        self.MONGO_PASSWORD: str = values.MONGO_PASSWORD
        self.MONGO_MODFLOW_DATABASE: str = values.MONGO_MODFLOW_DATABASE
        self.MONGO_SENSOR_DATABASE: str = values.MONGO_SENSOR_DATABASE
        self.MORPHEUS_MODFLOW_LOCAL_DATA: str = values.MORPHEUS_MODFLOW_LOCAL_DATA
        self.MORPHEUS_SENSORS_UIT_FTP_HOST: str = values.MORPHEUS_SENSORS_UIT_FTP_HOST
        self.MORPHEUS_SENSORS_UIT_FTP_USER: str = values.MORPHEUS_SENSORS_UIT_FTP_USER
        self.MORPHEUS_SENSORS_UIT_FTP_PASSWORD: str = values.MORPHEUS_SENSORS_UIT_FTP_PASSWORD
        self.MORPHEUS_SENSORS_UIT_FTP_PATH: str = values.MORPHEUS_SENSORS_UIT_FTP_PATH
        self.MORPHEUS_SENSORS_LOCAL_DATA: str = values.MORPHEUS_SENSORS_LOCAL_DATA
        self.OPENAPI_LOCAL_SPEC_FILE: str = os.path.abspath(os.path.join(os.path.dirname(__file__), 'openapi.yml'))
        self.OPENAPI_BUNDLED_SPEC_FILE: str = os.path.abspath(
            os.path.join(os.path.dirname(__file__), 'openapi.bundle.yml'))
        self.CELERY_BROKER = values.CELERY_BROKER
        self.CELERY_RESULT_BACKEND = values.CELERY_RESULT_BACKEND
        self.CELERY_INCLUDE_TASK_MODULES = ['morpheus.modflow.tasks']

    @classmethod
    def from_dynaconf(cls, dynaconf: Dynaconf):
        return cls(dynaconf.current_env, dynaconf)

    def __getitem__(self, key):
        return getattr(self, key)

    def is_production(self):
        return self.ENV == 'production'


settings = Settings.from_dynaconf(
    Dynaconf(
        load_dotenv=True,
        environments=True,
        envvar_prefix="BACKEND",
        env=os.environ.get('FLASK_ENV', 'production'),
        validators=[
            Validator('SECRET_KEY', must_exist=True),
            Validator('KEYCLOAK_CLIENT_ID', must_exist=True),
            Validator('KEYCLOAK_CLIENT_SECRET', must_exist=True),
            Validator('KEYCLOAK_REALM', must_exist=True),
            Validator('KEYCLOAK_SERVER_URL', must_exist=True),
            Validator('MONGO_HOST', must_exist=True),
            Validator('MONGO_PORT', must_exist=True),
            Validator('MONGO_USER', must_exist=True),
            Validator('MONGO_PASSWORD', must_exist=True),
            Validator('MONGO_MODFLOW_DATABASE', must_exist=True),
            Validator('MONGO_SENSOR_DATABASE', must_exist=True),
            Validator('MORPHEUS_MODFLOW_LOCAL_DATA', default='/mnt/modflow/'),
            Validator('MORPHEUS_SENSORS_UIT_FTP_HOST', must_exist=True),
            Validator('MORPHEUS_SENSORS_UIT_FTP_USER', must_exist=True),
            Validator('MORPHEUS_SENSORS_UIT_FTP_PASSWORD', must_exist=True),
            Validator('MORPHEUS_SENSORS_UIT_FTP_PATH', default='/'),
            Validator('MORPHEUS_SENSORS_LOCAL_DATA', default='/mnt/sensors/'),
        ]
    )
)
