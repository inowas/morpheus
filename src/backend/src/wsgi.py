# from logging.config import dictConfig
import sentry_sdk
from flask import Flask
from sentry_sdk.integrations.flask import FlaskIntegration

from morpheus.app import bootstrap
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

if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for tracing.
        traces_sample_rate=1.0,
        # Set profiles_sample_rate to 1.0 to profile 100%
        # of sampled transactions.
        # We recommend adjusting this value in production.
        profiles_sample_rate=1.0,
        integrations=[FlaskIntegration()],
    )

app = Flask(__name__)

for key, value in vars(settings).items():
    app.config[key] = value

bootstrap(app)
