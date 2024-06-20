from morpheus.project.application.write.Calculation.RunCalculation import RunCalculationCommand, RunCalculationCommandHandler
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId
from task_queue import task_queue


@task_queue.task
def run_calculation_by_id(project_id: str, calculation_id: str):
    try:
        run_calculation_command = RunCalculationCommand(project_id=ProjectId.from_str(project_id), calculation_id=CalculationId.from_str(calculation_id))
        RunCalculationCommandHandler().handle(run_calculation_command)
    except Exception as e:
        raise e
