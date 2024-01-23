from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from morpheus.settings import settings


def get_database_client(db_name: str, create_if_not_exist: bool = False) -> Database:
    client = MongoClient(
        host=settings.MONGO_HOST,
        port=settings.MONGO_PORT,
        username=settings.MONGO_USER,
        password=settings.MONGO_PASSWORD,
        authSource=db_name,
    )
    if not create_if_not_exist and db_name not in client.list_database_names():
        raise ValueError(f'Database {db_name} does not exist')

    return client[db_name]


def create_or_get_collection(db: Database, collection_name: str, on_create_callback=None) -> Collection:
    if collection_name in db.list_collection_names():
        return db.get_collection(collection_name)

    collection = db.create_collection(collection_name)
    if callable(on_create_callback):
        on_create_callback(collection)

    return collection


class RepositoryBase:
    def __init__(self, collection: Collection):
        self.collection = collection
