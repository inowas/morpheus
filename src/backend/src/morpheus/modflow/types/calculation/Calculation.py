import dataclasses

from morpheus.common.types import Uuid
from ..ModflowModel import ModflowModel


@dataclasses.dataclass
class CalculationProfile:
    name: str
    description: str
    packages: {str: dict}
    available_flow_packages: list[str]

    def get_available_packages(self):
        raise NotImplementedError()


class CalculationId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class Calculation:
    calculation_id: CalculationId
    calculation_profile: CalculationProfile
    modflow_model: ModflowModel
    calculation_status: str
    calculation_summary: str
    calculation_error: str | None
    calculation_log: str
    calculation_results: dict | None
