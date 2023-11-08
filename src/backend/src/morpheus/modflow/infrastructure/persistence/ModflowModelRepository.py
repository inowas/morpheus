from morpheus.modflow.types.Metadata import Metadata
from morpheus.modflow.types.ModflowModel import ModflowModel, ModelId
from morpheus.common.infrastructure.persistence.mongodb import Database, get_database_client
from morpheus.modflow.types.TimeDiscretization import TimeDiscretization
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

    def get_modflow_models_metadata(self) -> list | None:
        collection_name = 'modflow_models'
        if not self.has_collection(collection_name):
            return None
        collection = self.get_collection(collection_name)
        model_dict = collection.find({}, {'id': 1, 'metadata': 1})
        if model_dict is None:
            return None

        result = []
        for model in model_dict:
            result.append({
                'id': model['id'],
                'metadata': model['metadata']
            })

        return result

    def get_modflow_model_metadata(self, model_id: ModelId) -> Metadata | None:
        collection_name = 'modflow_models'
        if not self.has_collection(collection_name):
            return None
        collection = self.get_collection(collection_name)
        model_dict = collection.find_one({'id': model_id.to_str()}, {'metadata': 1})
        if model_dict is None:
            return None
        return Metadata.from_dict(model_dict['metadata'])

    def update_modflow_model_metadata(self, model_id: ModelId, metadata: Metadata):
        collection_name = 'modflow_models'
        if not self.has_collection(collection_name):
            self.create_collection(collection_name)
        collection = self.get_collection(collection_name)
        existing_model = collection.find_one({'id': model_id.to_str()}, {'metadata': 1})
        if existing_model is None:
            return

        collection.update_one({'id': model_id.to_str()}, {'$set': {'metadata': metadata.to_dict()}})

    def get_modflow_model_time_discretization(self, model_id: ModelId) -> TimeDiscretization | None:
        collection_name = 'modflow_models'
        if not self.has_collection(collection_name):
            return None
        collection = self.get_collection(collection_name)
        model_dict = collection.find_one({'id': model_id.to_str()}, {'time_discretization': 1})
        if model_dict is None:
            return None
        return TimeDiscretization.from_dict(model_dict['time_discretization'])

    def update_modflow_model_time_discretization(self, model_id: ModelId, time_discretization: TimeDiscretization):
        collection_name = 'modflow_models'
        if not self.has_collection(collection_name):
            self.create_collection(collection_name)
        collection = self.get_collection(collection_name)
        existing_model = collection.find_one({'id': model_id.to_str()})
        if existing_model is None:
            return

        collection.update_one({'id': model_id.to_str()},
                              {'$set': {'time_discretization': time_discretization.to_dict()}})

    def get_modflow_model(self, model_id: ModelId) -> ModflowModel | None:
        collection_name = 'modflow_models'
        if not self.has_collection(collection_name):
            return None
        collection = self.get_collection(collection_name)
        model_dict = collection.find_one({'id': model_id.to_str()})
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
