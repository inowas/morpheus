from enum import StrEnum
from typing import Tuple

from morpheus.project.types.Model import Model
from morpheus.project.types.calculation.Calculation import CalculationLog
from morpheus.project.types.calculation.CalculationProfile import CalculationProfile
from morpheus.project.types.calculation.CalculationResult import CalculationResult, Observation


class CalculationEngineType(StrEnum):
    MF2005 = 'mf2005'


class CalculationEngineBase:
    on_start_preprocessing_callback = None
    on_start_running_callback = None

    def on_start_preprocessing(self, callback):
        self.on_start_preprocessing_callback = callback

    def on_start_running(self, callback):
        self.on_start_running_callback = callback

    def run(self, model: Model, calculation_profile: CalculationProfile) -> Tuple[
        CalculationLog, CalculationResult
    ]:
        raise NotImplementedError

    def trigger_start_preprocessing(self):
        if self.on_start_preprocessing_callback is None:
            return

        self.on_start_preprocessing_callback()

    def trigger_start_running(self):
        if self.on_start_running_callback is None:
            return

        self.on_start_running_callback()

    def read_budget(
        self,
        totim: float | None = None,
        idx: int | None = None,
        kstpkper: Tuple[int, int] | None = None,
        incremental=False
    ):
        raise NotImplementedError

    def read_concentration(
        self,
        totim: float | None = None,
        idx: int | None = None,
        kstpkper: Tuple[int, int] | None = None,
        layer=0
    ):
        raise NotImplementedError

    def read_drawdown(
        self,
        totim: float | None = None,
        idx: int | None = None,
        kstpkper: Tuple[int, int] | None = None,
        layer=0
    ):
        raise NotImplementedError

    def read_head(
        self,
        totim: float | None = None,
        idx: int | None = None,
        kstpkper: Tuple[int, int] | None = None,
        layer=0
    ):
        raise NotImplementedError

    def read_head_observations(self) -> list[Observation]:
        raise NotImplementedError
