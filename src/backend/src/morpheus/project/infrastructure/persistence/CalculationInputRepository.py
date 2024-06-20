from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId, CalculationInput
from morpheus.settings import settings


class CalculationInputRepository(RepositoryBase):
    def has_calculation_input(self, project_id: ProjectId, calculation_id: CalculationId) -> bool:
        return self.collection.find_one({
            'project_id': project_id.to_str(),
            'calculation_id': calculation_id.to_str()
        }) is not None

    def get_calculation_input(self, project_id: ProjectId, calculation_id: CalculationId) -> CalculationInput | None:
        document = self.collection.find_one({
            'project_id': project_id.to_str(),
            'calculation_id': calculation_id.to_str()
        })

        if document is None:
            return None

        return CalculationInput.from_dict(document)

    def save_calculation_input(self, calculation_input: CalculationInput) -> None:
        if self.has_calculation_input(project_id=calculation_input.project_id, calculation_id=calculation_input.calculation_id):
            raise Exception(f'Calculation Input {calculation_input.calculation_id.to_str()} already exists.')

        self.collection.insert_one(calculation_input.to_dict())

    def delete_calculation_input(self, project_id: ProjectId, calculation_id: CalculationId) -> None:
        if not self.has_calculation_input(project_id=project_id, calculation_id=calculation_id):
            raise Exception(f'Calculation Input {calculation_id.to_str()} does not exist.')

        self.collection.delete_one({
            'project_id': project_id.to_str(),
            'calculation_id': calculation_id.to_str()
        })


calculation_input_repository = CalculationInputRepository(
    collection=create_or_get_collection(
        get_database_client(settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'calculation_inputs'
    )
)


def get_calculation_input_repository() -> CalculationInputRepository:
    return calculation_input_repository
