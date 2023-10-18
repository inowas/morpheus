from pymongo import MongoClient
from morpheus.common.infrastructure.persistence.mongodb import get_database_client
from morpheus.settings import settings


def get_database() -> MongoClient:
    return get_database_client(settings.MONGO_SENSOR_DATABASE)
