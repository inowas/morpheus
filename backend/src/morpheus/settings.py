import os
from dynaconf import Dynaconf, Validator


class Settings:

    def __init__(self, env: str, values):
        valid_environments = ['production', 'development', 'testing']
        if env not in valid_environments:
            raise ValueError(f"environment must be one of {valid_environments}")

        self.ENV: str = env
        self.SECRET_KEY: str = values.SECRET_KEY
        self.POSTGRES_DB: str = values.POSTGRES_DB
        self.POSTGRES_USER: str = values.POSTGRES_USER
        self.POSTGRES_HOST: str = values.POSTGRES_HOST
        self.POSTGRES_PORT: str = values.POSTGRES_PORT
        self.POSTGRES_PASSWORD: str = values.POSTGRES_PASSWORD

    @classmethod
    def from_dynaconf(cls, dynaconf: Dynaconf):
        return cls(dynaconf.current_env, dynaconf)

    def __getitem__(self, key):
        return getattr(self, key)

    def is_production(self):
        return self.ENV == 'production'


settings = Settings.from_dynaconf(
    Dynaconf(
        environments=True,
        settings_files=['settings.toml', '.secrets.toml'],
        env=os.environ.get('FLASK_ENV', 'production'),
        validators=[
            Validator('SECRET_KEY', must_exist=True),
            Validator('POSTGRES_DB', must_exist=True),
            Validator('POSTGRES_USER', must_exist=True),
            Validator('POSTGRES_HOST', must_exist=True),
            Validator('POSTGRES_PORT', must_exist=True),
            Validator('POSTGRES_PASSWORD', must_exist=True),
        ]
    )
)