from enum import StrEnum
from typing import Tuple

from morpheus.project.types.Model import Model
from morpheus.project.types.calculation.Calculation import Log, CalculationState
from morpheus.project.types.calculation.CalculationProfile import CalculationProfile
from morpheus.project.types.calculation.CalculationResult import CalculationResult, CalculationObservationResultItem


class CalculationEngineType(StrEnum):
    MF2005 = 'mf2005'


class CalculationEngineBase:
    on_change_calculation_state_callback = None
    on_finish_preprocessing_callback = None
    on_start_running_callback = None

    def on_change_calculation_state(self, callback):
        self.on_change_calculation_state_callback = callback

    def preprocess(self, model: Model, calculation_profile: CalculationProfile) -> Log:
        raise NotImplementedError

    def run(self, model: Model, calculation_profile: CalculationProfile) -> Tuple[Log, CalculationResult]:
        raise NotImplementedError

    def trigger_calculation_state_change(self, new_state: CalculationState):
        if self.on_change_calculation_state_callback is None:
            return

        self.on_change_calculation_state_callback(new_state)

    def read_flow_budget(
        self,
        totim: float | None = None,
        idx: int | None = None,
        kstpkper: Tuple[int, int] | None = None,
        incremental=False
    ):
        raise NotImplementedError

    def read_transport_concentration(
        self,
        totim: float | None = None,
        idx: int | None = None,
        kstpkper: Tuple[int, int] | None = None,
        layer=0,
        precision=4
    ):
        raise NotImplementedError

    def read_transport_concentration_time_series(
        self,
        layer: int,
        row: int,
        col: int,
        precision=4
    ):
        raise NotImplementedError

    def read_transport_budget(
        self,
        totim: float | None = None,
        idx: int | None = None,
        kstpkper: Tuple[int, int] | None = None,
        incremental=False
    ):
        raise NotImplementedError

    def read_flow_drawdown(
        self,
        totim: float | None = None,
        idx: int | None = None,
        kstpkper: Tuple[int, int] | None = None,
        layer=0,
        precision=4
    ):
        raise NotImplementedError

    def read_flow_drawdown_time_series(
        self,
        layer: int,
        row: int,
        col: int,
        precision=4
    ):
        raise NotImplementedError

    def read_flow_head(
        self,
        totim: float | None = None,
        idx: int | None = None,
        kstpkper: Tuple[int, int] | None = None,
        layer=0,
        precision=4
    ):
        raise NotImplementedError

    def read_flow_head_time_series(
        self,
        layer: int,
        row: int,
        col: int,
        precision=4
    ):
        raise NotImplementedError

    def read_number_of_head_observations(self) -> int:
        raise NotImplementedError

    def read_head_observations(self, model: Model) -> list[CalculationObservationResultItem]:
        raise NotImplementedError

    def read_file(self, file_name: str) -> str | None:
        raise NotImplementedError

    def get_packages(self) -> list[str]:
        raise NotImplementedError

    def get_package(self, package_name: str):
        raise NotImplementedError
