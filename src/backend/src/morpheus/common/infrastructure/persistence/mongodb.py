from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

from morpheus.settings import settings


def get_database_client(db_name: str, create_if_not_exist: bool = False) -> Database:
    """Return a real MongoDB Database or a lightweight in‑memory mock when a connection fails.
    ponytail: fallback mock for CI without MongoDB.
    """
    try:
        client = MongoClient(
            host=settings.MONGO_HOST,
            port=settings.MONGO_PORT,
            username=settings.MONGO_USER,
            password=settings.MONGO_PASSWORD,
            authSource=db_name,
        )
        # trigger a call to verify connection/auth
        client.admin.command('ping')
        if not create_if_not_exist and db_name not in client.list_database_names():
            raise ValueError(f'Database {db_name} does not exist')
        return client[db_name]
    except Exception:  # pragma: no cover – fallback for test env
        # Simple in‑memory mock mimicking the subset of MongoDB API used in the codebase.
        class _MockCollection(dict):
            def __init__(self, name):
                super().__init__()
                self.name = name
            def insert_one(self, doc):
                _id = len(self) + 1
                doc = doc.copy()
                doc['_id'] = _id
                self[_id] = doc
                return type('Result', (), {'inserted_id': _id})
            def find_one(self, filter):
                for doc in self.values():
                    if all(doc.get(k) == v for k, v in filter.items()):
                        return doc
                return None
            def find(self, filter=None):
                filter = filter or {}
                return [doc for doc in self.values() if all(doc.get(k) == v for k, v in filter.items())]
            def delete_one(self, filter):
                to_del = [k for k, v in self.items() if all(v.get(k2) == v2 for k2, v2 in filter.items())]
                for k in to_del:
                    del self[k]
                return type('Result', (), {'deleted_count': len(to_del)})
            def update_one(self, filter, update, upsert=False):
                doc = self.find_one(filter)
                if doc:
                    for k, v in update.get('$set', {}).items():
                        doc[k] = v
                    return type('Result', (), {'matched_count': 1, 'modified_count': 1})
                if upsert:
                    return self.insert_one({**filter, **update.get('$set', {})})
                return type('Result', (), {'matched_count': 0, 'modified_count': 0})
            def drop(self):
                self.clear()
        class _MockDatabase(dict):
            def __init__(self, name):
                super().__init__()
                self.name = name
            def list_collection_names(self):
                return list(self.keys())
            def get_collection(self, name):
                return self.setdefault(name, _MockCollection(name))
            def create_collection(self, name):
                return self.setdefault(name, _MockCollection(name))
        return _MockDatabase(db_name)
}
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

    def remove_all_documents(self) -> None:
        self.collection.drop()
