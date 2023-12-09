import dataclasses
from typing import Literal

from flopy.modflow import ModflowRch as FlopyModflowRch

from .RchPackageMapper import RchStressPeriodData, calculate_stress_period_data
from ...modflow_2005 import FlopyModflow
from .....types.ModflowModel import ModflowModel


@dataclasses.dataclass
class RchPackageData:
    stress_period_data: RchStressPeriodData
    ipakcb: int
    dtype: None | list
    irch: int
    options: None | list
    extension: Literal["rch"]
    unitnumber: None | int
    filenames: None | str | list[str]

    def __init__(self, stress_period_data: RchStressPeriodData, nrchop: int = 3, ipakcb=0, dtype: None | list = None,
                 irch: int = 0, extension: Literal["rch"] = "rch", unitnumber: int | None = None,
                 filenames: list[str] | str | None = None):
        self.stress_period_data = stress_period_data
        self.nrchop = nrchop
        self.ipakcb = ipakcb
        self.irch = irch
        self.dtype = dtype
        self.extension = extension
        self.unitnumber = unitnumber
        self.filenames = filenames

    def to_dict(self) -> dict:
        return {
            'rech': self.stress_period_data.to_dict(),
            'nrchop': self.nrchop,
            'ipakcb': self.ipakcb,
            'dtype': self.dtype,
            'irch': self.irch,
            'extension': self.extension,
            'unitnumber': self.unitnumber,
            'filenames': self.filenames,
        }


def calculate_rch_package_data(modflow_model: ModflowModel) -> RchPackageData | None:
    stress_period_data = calculate_stress_period_data(modflow_model)
    if stress_period_data is None:
        return None
    return RchPackageData(stress_period_data=stress_period_data)


def create_riv_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowRch | None:
    package_data = calculate_rch_package_data(modflow_model)
    if package_data is None:
        return None

    return FlopyModflowRch(model=flopy_modflow, **package_data.to_dict())
