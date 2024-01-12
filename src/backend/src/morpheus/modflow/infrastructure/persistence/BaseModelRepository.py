from morpheus.modflow.types.ModflowModel import ModflowModel, ModelId
from morpheus.modflow.types.Project import ProjectId
from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, \
    create_or_get_collection
from morpheus.modflow.types.discretization.time.TimeDiscretization import TimeDiscretization
from morpheus.settings import settings


class BaseModelRepository(RepositoryBase):

    def has_base_model(self, project_id: ProjectId) -> bool:
        return self.collection.find_one({'project_id': project_id.to_str()}) is not None

    def get_base_model(self, project_id: ProjectId) -> ModflowModel | None:
        project = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0, 'base_model_id': 1})
        if project is None:
            return None
        return ModflowModel.from_dict(project['base_model'])

    def save_base_model(self, project_id: ProjectId, base_model: ModflowModel) -> None:
        if self.has_base_model(project_id):
            raise Exception('Base Model already exists')
        self.collection.insert_one({
            'project_id': project_id.to_str(),
            'base_model': base_model.to_dict()
        })

    def update_base_model(self, project_id: ProjectId, base_model: ModflowModel) -> None:
        if not self.has_base_model(project_id):
            raise Exception('Base Model does not exist yet ')
        self.collection.insert_one({
            'project_id': project_id.to_str(),
            'base_model': base_model.to_dict()
        })

    def get_base_model_time_discretization(self, project_id: ProjectId, model_id: ModelId) -> TimeDiscretization | None:
        result = self.collection.find_one(
            {'project_id': project_id.to_str(), 'base_model.model_id': model_id.to_str()},
            {'_id': 0, 'base_model.time_discretization': 1})
        if result is None:
            return None

        return TimeDiscretization.from_dict(result['base_model']['time_discretization'])

    def update_base_model_time_discretization(self, project_id: ProjectId, model_id: ModelId,
                                              time_discretization: TimeDiscretization) -> None:

        self.collection.update_one({'project_id': project_id.to_str(), 'base_model.model_id': model_id.to_str()},
                                   {'$set': {'base_model.time_discretization': time_discretization.to_dict()}})


base_model_repository = BaseModelRepository(
    collection=create_or_get_collection(
        get_database_client(settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'base_models'
    )
)
