from morpheus.common.types.Exceptions import NotFoundException
from ...infrastructure.persistence.CalculationsRepository import CalculationsRepository, calculations_repository
from ...types.Project import ProjectId
from ...types.calculation.Calculation import Calculation, CalculationId


class CalculationsReader:
    _repository: CalculationsRepository

    def __init__(self, repository: CalculationsRepository):
        self._repository = repository

    def get_calculations(self, project_id: ProjectId) -> list[Calculation]:
        return self._repository.get_calculations(project_id)

    def get_calculation(self, project_id: ProjectId, calculation_id: CalculationId) -> Calculation:
        calculation = self._repository.get_calculation(project_id=project_id, calculation_id=calculation_id)
        if calculation is None:
            raise NotFoundException(f'Calculation {calculation_id} for project {project_id} not found.')
        return calculation


calculations_reader = CalculationsReader(repository=calculations_repository)


def get_calculations_reader() -> CalculationsReader:
    return calculations_reader
