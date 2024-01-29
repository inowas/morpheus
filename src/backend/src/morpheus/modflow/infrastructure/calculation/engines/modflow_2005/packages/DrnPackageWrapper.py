import dataclasses
from typing import Literal

from flopy.modflow import ModflowDrn as FlopyModflowDrn

from .DrnPackageMapper import DrnStressPeriodData, calculate_stress_period_data
from ...modflow_2005 import FlopyModflow
from morpheus.modflow.types.ModflowModel import ModflowModel


@dataclasses.dataclass
class DrnPackageData:
    stress_period_data: DrnStressPeriodData
    ipakcb: None | int
    dtype: None | list
    options: None | list
    extension: Literal["drn"]
    unitnumber: None | int
    filenames: None | str | list[str]

    def __init__(self, stress_period_data: DrnStressPeriodData, ipakcb: None | int = None, dtype: None | list = None,
                 options: None | list = None, extension: Literal["drn"] = "drn", unitnumber: int | None = None,
                 filenames: list[str] | str | None = None):
        self.stress_period_data = stress_period_data
        self.ipakcb = ipakcb
        self.dtype = dtype
        self.options = options
        self.extension = extension
        self.unitnumber = unitnumber
        self.filenames = filenames

    def to_dict(self) -> dict:
        return {
            'stress_period_data': self.stress_period_data.to_dict(),
            'ipakcb': self.ipakcb,
            'dtype': self.dtype,
            'options': self.options,
            'extension': self.extension,
            'unitnumber': self.unitnumber,
            'filenames': self.filenames,
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)


def calculate_drn_package_data(modflow_model: ModflowModel) -> DrnPackageData | None:
    stress_period_data = calculate_stress_period_data(modflow_model)
    if stress_period_data is None:
        return None
    return DrnPackageData(stress_period_data=stress_period_data)


def create_drn_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowDrn | None:
    package_data = calculate_drn_package_data(modflow_model)
    if package_data is None:
        return None

    return FlopyModflowDrn(model=flopy_modflow, **package_data.to_dict())
