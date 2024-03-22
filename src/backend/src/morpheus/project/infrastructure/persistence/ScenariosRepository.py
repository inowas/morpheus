import dataclasses

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.settings import settings as app_settings
from ...types.Project import ProjectId
from ...types.Scenarios import ScenarioCollection


@dataclasses.dataclass(frozen=True)
class ScenariosRepositoryDocument:
    project_id: str
    scenarios: dict

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            scenarios=obj['scenarios'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_scenarios(self) -> ScenarioCollection:
        return ScenarioCollection.from_dict(self.scenarios)

    def with_updated_scenarios(self, scenarios: ScenarioCollection):
        return dataclasses.replace(self, scenarios=scenarios.to_dict())


class ScenariosRepository(RepositoryBase):
    def has_scenarios(self, project_id: ProjectId) -> bool:
        return self.collection.find_one({'project_id': project_id.to_str()}) is not None

    def get_scenarios(self, project_id: ProjectId) -> ScenarioCollection:
        data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if data is None:
            raise Exception('Scenarios do not exist')

        return ScenariosRepositoryDocument.from_dict(dict(data)).get_scenarios()

    def save_scenarios(self, project_id: ProjectId, scenarios: ScenarioCollection) -> None:
        if self.has_scenarios(project_id):
            raise Exception(f'Scenarios already exist for project {project_id.to_str()}')

        document = ScenariosRepositoryDocument(project_id=project_id.to_str(), scenarios=scenarios.to_dict())
        self.collection.insert_one(document.to_dict())

    def update_scenarios(self, project_id: ProjectId, scenarios: ScenarioCollection) -> None:
        if not self.has_scenarios(project_id):
            raise Exception(f'Scenarios do not exist for project {project_id.to_str()}')

        document = ScenariosRepositoryDocument(project_id=project_id.to_str(), scenarios=scenarios.to_dict())
        self.collection.update_one(filter={'project_id': project_id.to_str()}, update={'$set': document.to_dict()})

    def save_or_update_scenarios(self, project_id: ProjectId, scenarios: ScenarioCollection) -> None:
        if self.has_scenarios(project_id):
            self.update_scenarios(project_id, scenarios)
        else:
            self.save_scenarios(project_id, scenarios)


scenarios_repository = ScenariosRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'scenarios'
    )
)
