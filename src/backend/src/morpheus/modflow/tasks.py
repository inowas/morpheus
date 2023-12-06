import os

from morpheus.modflow.infrastructure.calculation.modflow_2005.types.Calculation import CalculationId, \
    Modflow2005Calculation
from task_queue import task_queue


@task_queue.task
def calculate_modflow_model_by_id(calculation_id: str):
    calculation_id = CalculationId.from_value(calculation_id)
    return calculation_id.to_value()


@task_queue.task
def calculate_modflow_model(calculation: dict):
    calculation = Modflow2005Calculation.from_dict(calculation)
    calculation_id = calculation.calculation_id
    calculation.preprocess(
        model_ws=os.path.join(os.getcwd(), 'data', calculation_id.to_str()),
        exe_name='mf2005',
    )

    calculation.write_input()
    calculation.run()
