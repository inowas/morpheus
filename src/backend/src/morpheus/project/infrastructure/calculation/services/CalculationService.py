from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineBase import CalculationEngineBase
from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineFactory import CalculationEngineFactory
from morpheus.project.types.Model import Model
from morpheus.project.types.calculation.Calculation import Log
from morpheus.project.types.calculation.CalculationProfile import CalculationProfile
from morpheus.project.types.calculation.CalculationResult import CalculationResult


class CalculationService:
    engine: CalculationEngineBase
    check_model_log: Log | None
    calculation_log: Log | None
    calculation_result: CalculationResult | None

    @classmethod
    def calculate(cls, model: Model, profile: CalculationProfile):
        instance = cls()
        instance.engine = CalculationEngineFactory().create_engine(engine_type=profile.engine_type)
        try:
            instance.check_model_log = instance.engine.preprocess(model=model, calculation_profile=profile)
            instance.calculation_log, instance.calculation_result = instance.engine.run(model=model, calculation_profile=profile)

        except Exception as e:
            calculation_log = Log.from_str(str(e))
            instance.calculation_log = calculation_log

        return instance

    def get_result(self):
        return self.calculation_result

    def get_calculation_log(self):
        return self.calculation_log

    def get_check_model_log(self):
        return self.check_model_log

    def read_flow_budget(self, idx: int, incremental: bool = False):
        return self.engine.read_flow_budget(idx=idx, incremental=incremental)

    def read_flow_drawdown(self, idx: int, layer: int):
        return self.engine.read_flow_drawdown(idx=idx, layer=layer)

    def read_flow_head(self, idx: int, layer: int):
        return self.engine.read_flow_head(idx=idx, layer=layer)

    def read_transport_concentration(self, idx: int, layer: int):
        return self.engine.read_transport_concentration(idx=idx, layer=layer)

    def read_transport_budget(self, idx: int, incremental: bool = False):
        return self.engine.read_transport_budget(idx=idx, incremental=incremental)

    def read_head_observations(self):
        return self.engine.read_head_observations()
