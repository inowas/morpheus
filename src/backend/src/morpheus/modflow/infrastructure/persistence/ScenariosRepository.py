from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.settings import settings as app_settings
from ...types.Project import ProjectId
from ...types.Scenarios import ScenarioCollection


class ScenariosRepository(RepositoryBase):
    def has_scenarios(self, project_id: ProjectId) -> bool:
        return self.collection.find_one({'project_id': project_id.to_str()}) is not None

    def get_scenarios(self, project_id: ProjectId) -> ScenarioCollection:
        result = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0, 'scenarios': 1})
        if result is None or 'scenarios' not in result:
            raise Exception('Scenarios do not exist')

        return ScenarioCollection.from_dict(result['scenarios'])

    def save_scenarios(self, project_id: ProjectId, scenarios: ScenarioCollection) -> None:
        if self.has_scenarios(project_id):
            raise Exception('Scenarios already exist')

        self.collection.insert_one({
            'project_id': project_id.to_str(),
            'scenarios': scenarios.to_dict()
        })

    def update_scenarios(self, project_id: ProjectId, scenarios: ScenarioCollection) -> None:
        if not self.has_scenarios(project_id):
            raise Exception('Scenarios do not exist')

        self.collection.replace_one({'project_id': project_id.to_str()}, {'scenarios': scenarios.to_dict()})

    def save_or_update_scenarios(self, project_id: ProjectId, scenarios: ScenarioCollection) -> None:
        if self.has_scenarios(project_id):
            self.update_scenarios(project_id, scenarios)
        else:
            self.save_scenarios(project_id, scenarios)


scenarios_repository = ScenariosRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'scenarios'
    )
)
