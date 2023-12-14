import dataclasses

from morpheus.modflow.types.calculation.CalculationResult import CalculationResult


@dataclasses.dataclass(frozen=True)
class CalculationEngineRunReport:
    calculation_log: list[str]
    calculation_result: CalculationResult
