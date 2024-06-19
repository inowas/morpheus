from datetime import datetime

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, \
    create_or_get_collection
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId, Calculation
from morpheus.project.types.calculation.CalculationResult import CalculationResult
from morpheus.settings import settings


class CalculationsRepository(RepositoryBase):
    def has_calculation(self, project_id: ProjectId, calculation_id: CalculationId) -> bool:
        return self.collection.find_one({
            'project_id': project_id.to_str(),
            'calculation_id': calculation_id.to_str()
        }) is not None

    def get_calculations(self, project_id: ProjectId) -> list[Calculation]:
        documents = self.collection.find({
            'project_id': project_id.to_str()}, {'_id': 0, 'calculation': 1}
        )
        if documents is None:
            return []
        return [Calculation.from_dict(document['calculation']) for document in documents]

    def get_calculation(self, project_id: ProjectId, calculation_id: CalculationId) -> Calculation | None:
        document = self.collection.find_one({
            'project_id': project_id.to_str(),
            'calculation_id': calculation_id.to_str(),
        }, {'_id': 0, 'calculation': 1})
        if document is None:
            return None

        return Calculation.from_dict(document['calculation'])

    def get_calculation_result(self, project_id: ProjectId, calculation_id: CalculationId) -> CalculationResult | None:
        document = self.collection.find_one({
            'project_id': project_id.to_str(),
            'calculation_id': calculation_id.to_str()
        }, {'_id': 0, 'calculation.calculation_result': 1})
        if document is None:
            return None

        return CalculationResult.try_from_dict(document['calculation']['calculation_result'])

    def save_calculation(self, project_id: ProjectId, calculation: Calculation) -> None:
        if self.has_calculation(project_id=project_id, calculation_id=calculation.calculation_id):
            raise Exception(f'Calculation {calculation.calculation_id.to_str()} for project {project_id.to_str()} already exists.')

        self.collection.insert_one({
            'project_id': project_id.to_str(),
            'calculation_id': calculation.calculation_id.to_str(),
            'calculation': calculation.to_dict(),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
        })

    def update_calculation(self, project_id: ProjectId, calculation: Calculation) -> None:
        if not self.has_calculation(project_id=project_id, calculation_id=calculation.calculation_id):
            raise Exception(f'Calculation {calculation.calculation_id.to_str()} does not exist yet.')

        self.collection.update_one(
            {'project_id': project_id.to_str(), 'calculation_id': calculation.calculation_id.to_str()},
            {
                '$set': {
                    'calculation': calculation.to_dict(),
                    'updated_at': datetime.now().isoformat(),
                }
            }
        )

    def delete_calculation(self, project_id: ProjectId, calculation_id: CalculationId) -> None:
        if not self.has_calculation(project_id=project_id, calculation_id=calculation_id):
            raise Exception(f'Calculation {calculation_id.to_str()} for project {project_id.to_str()} does not exist.')

        self.collection.delete_one({
            'project_id': project_id.to_str(),
            'calculation_id': calculation_id.to_str()
        })


calculations_repository = CalculationsRepository(
    collection=create_or_get_collection(
        get_database_client(settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'calculations'
    )
)


def get_calculations_repository() -> CalculationsRepository:
    return calculations_repository
