from dynaconf import FlaskDynaconf, Validator
from flask import Flask
from morpheus.app import register

app = Flask(__name__)

# inject and validate settings and secrets via Dynaconf (see folder config for settings and secrets file)
FlaskDynaconf(
    app,
    validators=[
        Validator('SECRET_KEY', must_exist=True),
    ]
)

# register routes and cli commands
register(app)

settings = app.config
