from morpheus.project.infrastructure.calculation.services.CalculationService import CalculationService
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId
from task_queue import task_queue


@task_queue.task
def run_calculation_by_id(project_id: str, calculation_id: str):
    calculation_service = CalculationService.from_calculation_id(project_id=ProjectId.from_str(project_id), calculation_id=CalculationId.from_str(calculation_id))
    calculation_service.calculate()
