from morpheus.common.types.Exceptions import NotFoundException
from ...infrastructure.persistence.CalculationInputRepository import CalculationInputRepository, get_calculation_input_repository
from ...types.Project import ProjectId
from ...types.calculation.Calculation import CalculationId, CalculationInput


class CalculationInputReader:
    _repository: CalculationInputRepository

    def __init__(self, repository: CalculationInputRepository):
        self._repository = repository

    def get_calculation(self, project_id: ProjectId, calculation_id: CalculationId) -> CalculationInput:
        calculation_input = self._repository.get_calculation_input(calculation_id=calculation_id, project_id=project_id)
        if calculation_input is None:
            raise NotFoundException(f'Calculation Input for Calculation ID: {calculation_id} not found.')
        return calculation_input


calculation_input_reader = CalculationInputReader(repository=get_calculation_input_repository())


def get_calculation_input_reader() -> CalculationInputReader:
    return calculation_input_reader
