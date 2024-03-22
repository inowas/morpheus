from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineBase import CalculationEngineBase
from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineFactory import CalculationEngineFactory
from morpheus.project.types.calculation.Calculation import CalculationId, CalculationState, Calculation
from morpheus.project.infrastructure.persistence.CalculationRepository import calculation_repository


class CalculationService:
    calculation: Calculation
    engine: CalculationEngineBase

    def __init__(self, calculation: Calculation):
        if not calculation_repository.has_calculation(calculation_id=calculation.calculation_id):
            calculation_repository.save_calculation(calculation)
        self.calculation = calculation
        self.engine = CalculationEngineFactory.create_engine(calculation)

    @classmethod
    def from_calculation(cls, calculation: Calculation):
        return cls(calculation=calculation)

    @classmethod
    def from_calculation_id(cls, calculation_id: CalculationId):
        calculation = calculation_repository.get_calculation(calculation_id=calculation_id)
        if calculation is None:
            raise Exception('Calculation does not exist')

        return cls(calculation=calculation)

    def calculate(self):
        if not self.calculation.calculation_state == CalculationState.CREATED:
            raise Exception('Calculation was already run or is still in progress')

        def on_start_preprocessing():
            self.calculation.set_new_state(CalculationState.PREPROCESSING)
            calculation_repository.update_calculation(self.calculation)

        def on_start_running():
            self.calculation.set_new_state(CalculationState.RUNNING)
            calculation_repository.update_calculation(self.calculation)

        self.engine.on_start_preprocessing(on_start_preprocessing)
        self.engine.on_start_running(on_start_running)

        try:
            log, result = self.engine.run(
                model=self.calculation.model,
                calculation_profile=self.calculation.calculation_profile
            )
            self.calculation.set_new_state(CalculationState.FINISHED)
            self.calculation.set_log(log)
            self.calculation.set_result(result)
            calculation_repository.update_calculation(self.calculation)
        except Exception as e:
            self.calculation.append_to_log(str(e))
            self.calculation.set_new_state(CalculationState.ERROR)
            calculation_repository.update_calculation(self.calculation)

    def get_result(self):
        return self.calculation.calculation_result

    def get_log(self):
        return self.calculation.calculation_log

    def get_calculation(self):
        return self.calculation

    def read_budget(self, idx: int, incremental: bool = False):
        return self.engine.read_budget(idx=idx, incremental=incremental)

    def read_concentration(self, idx: int, layer: int):
        return self.engine.read_concentration(idx=idx, layer=layer)

    def read_drawdown(self, idx: int, layer: int):
        return self.engine.read_drawdown(idx=idx, layer=layer)

    def read_head(self, idx: int, layer: int):
        return self.engine.read_head(idx=idx, layer=layer)

    def read_head_observations(self):
        return self.engine.read_head_observations()
