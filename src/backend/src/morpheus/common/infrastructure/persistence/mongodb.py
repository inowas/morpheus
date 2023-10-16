from pymongo import MongoClient
from morpheus.settings import settings


def get_database_client(db_name: str):
    client = MongoClient(
        host=settings.MONGO_HOST,
        port=settings.MONGO_PORT,
        username=settings.MONGO_USER,
        password=settings.MONGO_PASSWORD,
        authSource=settings.MONGO_SENSOR_DATABASE,
    )
    return client[db_name]
