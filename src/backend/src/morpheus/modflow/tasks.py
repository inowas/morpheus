import sys

from morpheus.modflow.infrastructure.calculation.CalculationEngineFactory import CalculationEngineFactory
from morpheus.modflow.infrastructure.persistence.CalculationRepository import calculation_repository
from morpheus.modflow.types.calculation.Calculation import CalculationId, CalculationState
from task_queue import task_queue


@task_queue.task
def run_calculation_by_id(calculation_id: str):
    calculation_id = CalculationId.from_str(calculation_id)
    calculation = calculation_repository.get_calculation(calculation_id=calculation_id)

    if calculation is None:
        raise Exception('Calculation does not exist')
    if not calculation.calculation_state == CalculationState.CREATED:
        raise Exception('Calculation was already run')

    engine = CalculationEngineFactory.create_engine(calculation)

    def on_start_preprocessing():
        calculation.set_new_state(CalculationState.PREPROCESSING)
        calculation_repository.update_calculation(calculation)

    def on_start_running():
        calculation.set_new_state(CalculationState.RUNNING)
        calculation_repository.update_calculation(calculation)

    engine.on_start_preprocessing(on_start_preprocessing)
    engine.on_start_running(on_start_running)

    try:
        report = engine.run(
            modflow_model=calculation.modflow_model,
            calculation_profile=calculation.calculation_profile
        )
        calculation.set_new_state(CalculationState.FINISHED)
        calculation.set_log(report.calculation_log)
        calculation.set_result(report.calculation_result)
        calculation_repository.update_calculation(calculation)
    except Exception as e:
        calculation.append_to_log(str(e))
        calculation.set_new_state(CalculationState.ERROR)
        calculation_repository.update_calculation(calculation)
