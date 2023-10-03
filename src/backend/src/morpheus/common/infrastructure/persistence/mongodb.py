from pymongo import MongoClient

from morpheus.settings import settings

host = settings['MONGO_HOST']
port = settings['MONGO_PORT']
user = settings['MONGO_USER']
password = settings['MONGO_PASSWORD']


def get_database_client(db_name: str):
    connection_string = f"mongodb://{user}:{password}@{host}:{port}"
    client = MongoClient(connection_string)
    return client[db_name]
