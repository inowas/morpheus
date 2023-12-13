from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.modflow.types.calculation.CalculationEngineRunReport import CalculationEngineRunReport
from morpheus.modflow.types.calculation.CalculationProfile import CalculationProfile


class CalculationEngineBase:
    on_start_preprocessing_callback = None
    on_start_running_callback = None

    def on_start_preprocessing(self, callback):
        self.on_start_preprocessing_callback = callback

    def on_start_running(self, callback):
        self.on_start_running_callback = callback

    def run(self, modflow_model: ModflowModel, calculation_profile: CalculationProfile) -> CalculationEngineRunReport:
        raise NotImplementedError

    def trigger_start_preprocessing(self):
        if self.on_start_preprocessing_callback is None:
            return

        self.on_start_preprocessing_callback()

    def trigger_start_running(self):
        if self.on_start_running_callback is None:
            return

        self.on_start_running_callback()
