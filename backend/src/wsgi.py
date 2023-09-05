# from logging.config import dictConfig

from flask import Flask

from morpheus.app import bootstrap
from morpheus.common.infrastructure.persistence.postgresql import db
from morpheus.settings import settings

# configure logging
# dictConfig({
#     'version': 1,
#     'formatters': {
#         'default': {
#             'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
#         }
#     },
#     'handlers': {
#         'error': {
#             'class': 'logging.FileHandler',
#             'filename': '../log/app.log',
#             'formatter': 'default'
#         }
#     },
#     'root': {
#         'level': 'WARNING',
#         'handlers': ['error']
#     }
# })


app = Flask(__name__)
for key, value in vars(settings).items():
    app.config[key] = settings.__getattribute__(key)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql+psycopg2://{}:{}@{}:{}/{}".format(
    settings.POSTGRES_USER,
    settings.POSTGRES_PASSWORD,
    settings.POSTGRES_HOST,
    settings.POSTGRES_PORT,
    settings.POSTGRES_DB,
)
db.init_app(app)

bootstrap(app)
