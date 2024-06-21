from morpheus.common.types.Exceptions import NotFoundException
from ...infrastructure.persistence.CalculationRepository import CalculationRepository, calculation_repository
from ...types.Project import ProjectId
from ...types.calculation.Calculation import Calculation, CalculationId


class CalculationReader:
    _repository: CalculationRepository

    def __init__(self, repository: CalculationRepository):
        self._repository = repository

    def get_calculation(self, project_id: ProjectId, calculation_id: CalculationId) -> Calculation:
        calculation = self._repository.get_calculation(project_id=project_id, calculation_id=calculation_id)
        if calculation is None:
            raise NotFoundException(f'Calculation {calculation_id} not found.')
        return calculation

    def get_calculations(self, project_id: ProjectId) -> list[Calculation]:
        calculations = self._repository.get_calculations_by_project_id(project_id=project_id)
        if calculations is None:
            raise NotFoundException(f'Calculations for project {project_id} not found.')
        return calculations


calculation_reader = CalculationReader(repository=calculation_repository)


def get_calculation_reader() -> CalculationReader:
    return calculation_reader
