import dataclasses
from typing import Literal

from morpheus.common.types import Uuid
from morpheus.modflow.types.ModflowModel import ModflowModel
from .modflow_2005.MfPackage import create_flopy_model, FlopyModflowModel
from .modflow_2005.DisPackage import calculate_dis_package_data


class CalculationId(Uuid):
    pass


@dataclasses.dataclass
class CalculationType:
    value: Literal['mf2005']

    @classmethod
    def mf2005(cls):
        return cls(value='mf2005')

    @classmethod
    def from_str(cls, value: str | Literal['mf2005', 'mf6']):
        if value not in ['mf2005', 'mf6']:
            raise ValueError(f'Invalid calculation type: {value}')
        return cls(value=value)

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value)

    def to_str(self):
        return self.value

    def to_value(self):
        return self.to_str()


@dataclasses.dataclass
class ModflowCalculation:
    calculation_id: CalculationId
    modflow_model: ModflowModel
    calculation_profile: dict

    def __init__(self, calculation_id: CalculationId, calculation_type: CalculationType, modflow_model: ModflowModel):
        self.calculation_id = calculation_id
        self.calculation_type = calculation_type
        self.modflow_model = modflow_model
        self.flopy_model = create_flopy_model(modflow_model=modflow_model)

    @classmethod
    def create(cls, modflow_model: ModflowModel):
        return cls(
            calculation_id=CalculationId.new(),
            calculation_type=CalculationType.mf2005(),
            modflow_model=modflow_model
        )
