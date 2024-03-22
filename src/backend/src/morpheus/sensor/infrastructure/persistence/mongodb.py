from pymongo.database import Database

from morpheus.common.infrastructure.persistence.mongodb import get_database_client
from morpheus.settings import settings


def get_database() -> Database:
    if settings.MONGO_SENSOR_DATABASE is None:
        raise ValueError('MONGO_SENSOR_DATABASE is not set')

    return get_database_client(settings.MONGO_SENSOR_DATABASE, create_if_not_exist=True)
