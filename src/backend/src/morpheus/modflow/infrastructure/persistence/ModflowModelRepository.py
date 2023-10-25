from morpheus.settings import settings
from morpheus.common.infrastructure.persistence.mongodb import Database, get_database_client


class ModflowModelRepository:
    db: Database

    def __init__(self):
        self.db = get_database_client(settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True)

    def create_collection(self, collection_name: str) -> None:
        self.db.create_collection(collection_name)

    def list_collection_names(self) -> list[str]:
        return self.db.list_collection_names()
