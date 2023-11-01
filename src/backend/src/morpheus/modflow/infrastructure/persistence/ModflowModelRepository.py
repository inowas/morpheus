from morpheus.modflow.types.Metadata import Metadata
from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.common.infrastructure.persistence.mongodb import Database, get_database_client
from morpheus.settings import settings


class ModflowModelRepository:
    db: Database

    def __init__(self):
        self.db = get_database_client(settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True)

    def create_collection(self, collection_name: str) -> None:
        self.db.create_collection(collection_name)

    def get_collection(self, collection_name: str):
        return self.db.get_collection(collection_name)

    def has_collection(self, collection_name: str) -> bool:
        return collection_name in self.list_collection_names()

    def list_collection_names(self) -> list[str]:
        return self.db.list_collection_names()

    def get_modflow_model_metadata(self, model_id: str) -> dict | None:
        collection_name = 'modflow_models'
        if not self.has_collection(collection_name):
            return None
        collection = self.get_collection(collection_name)
        model_dict = collection.find_one({'id': model_id})
        if model_dict is None:
            return None
        return model_dict['metadata']

    def update_modflow_model_metadata(self, model_id: str, metadata: Metadata):
        collection_name = 'modflow_models'
        if not self.has_collection(collection_name):
            self.create_collection(collection_name)
        collection = self.get_collection(collection_name)
        existing_model = collection.find_one({'id': model_id})
        if existing_model is None:
            return

        collection.update_one({'id': model_id}, {'$set': {'metadata': metadata.to_dict()}})

    def get_modflow_model(self, model_id: str) -> ModflowModel | None:
        collection_name = 'modflow_models'
        if not self.has_collection(collection_name):
            return None
        collection = self.get_collection(collection_name)
        model_dict = collection.find_one({'id': model_id})
        if model_dict is None:
            return None
        return ModflowModel.from_dict(model_dict)

    def save_modflow_model(self, modflow_model: ModflowModel):
        collection_name = 'modflow_models'
        if not self.has_collection(collection_name):
            self.create_collection(collection_name)
        collection = self.get_collection(collection_name)
        existing_model = collection.find_one({'id': modflow_model.id.to_str()})
        if existing_model is None:
            collection.insert_one(modflow_model.to_dict())
            return

        collection.replace_one({'id': modflow_model.id.to_str()}, modflow_model.to_dict())
