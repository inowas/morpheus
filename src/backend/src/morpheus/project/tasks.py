from morpheus.project.infrastructure.calculation.services.AsnycCalculationService import AsyncCalculationService
from morpheus.project.types.calculation.Calculation import CalculationId
from task_queue import task_queue


@task_queue.task
def run_calculation_by_id(calculation_id: str):
    try:
        AsyncCalculationService.calculate_by_worker(calculation_id=CalculationId.from_str(calculation_id))
    except Exception as e:
        raise e
