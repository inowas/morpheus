from morpheus.modflow.infrastructure.calculation.service.CalculationService import CalculationService
from morpheus.modflow.types.calculation.Calculation import CalculationId
from task_queue import task_queue


@task_queue.task
def run_calculation_by_id(calculation_id: str):
    calculation_id = CalculationId.from_str(calculation_id)
    calculation_service = CalculationService.from_calculation_id(calculation_id=calculation_id)
    calculation_service.calculate()
