import os

from morpheus.modflow.infrastructure.calculation.modflow_2005.types.Mf2005Calculation import CalculationId, \
    Mf2005Calculation
from morpheus.modflow.infrastructure.calculation.types.CalculationBase import CalculationState
from morpheus.modflow.infrastructure.persistence.CalculationRepository import CalculationRepository
from task_queue import task_queue
from morpheus.settings import settings


@task_queue.task
def calculate_modflow_model_by_id(calculation_id: str):
    calculation_repository = CalculationRepository()
    calculation_id = CalculationId.from_str(calculation_id)
    calculation = calculation_repository.get_calculation(calculation_id=calculation_id)

    if calculation is None:
        raise Exception('Calculation does not exist')

    calculation.calculation_state = CalculationState.preprocessing()
    calculation_repository.update_calculation_state(calculation=calculation)
    calculation.set_data_base_path(data_base_path=settings.MORPHEUS_MODFLOW_LOCAL_DATA)
    calculation.preprocess()
    calculation.write_input()

    calculation.calculation_state = CalculationState.running()
    calculation_repository.update_calculation_state(calculation=calculation)
    calculation.run()

    calculation_repository.update_calculation(calculation)
    calculation.postprocess()
    calculation_repository.update_calculation(calculation)


@task_queue.task
def calculate_modflow_model(calculation: dict):
    calculation = Mf2005Calculation.from_dict(calculation)
    calculation.process(data_base_path=os.path.join(os.getcwd(), 'data'))
    return calculation.to_dict()
