from flask import Flask
from morpheus.app import bootstrap
from morpheus.settings import settings

app = Flask(__name__)
for key, value in vars(settings).items():
    app.config[key] = settings.__getattribute__(key)

bootstrap(app)
