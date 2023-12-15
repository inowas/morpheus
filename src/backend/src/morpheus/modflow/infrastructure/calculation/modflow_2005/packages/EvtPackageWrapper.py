import dataclasses
from typing import Literal

from flopy.modflow import ModflowEvt as FlopyModflowEvt

from .EvtPackageMapper import EvtStressPeriodData, calculate_stress_period_data
from ...modflow_2005 import FlopyModflow
from .....types.ModflowModel import ModflowModel


@dataclasses.dataclass
class EvtPackageData:
    stress_period_data: EvtStressPeriodData
    ievt: int
    nevtop: int
    ipakcb: None | int
    extension: Literal["evt"]
    unitnumber: None | int
    filenames: None | str | list[str]
    external: bool

    def __init__(self, stress_period_data: EvtStressPeriodData, nevtop: int = 1, ievt: int = 1,
                 ipakcb: None | int = None, extension: Literal["evt"] = 'evt', unitnumber: int | None = None,
                 filenames: list[str] | str | None = None, external: bool = False):
        self.stress_period_data = stress_period_data
        self.ievt = ievt
        self.nevtop = nevtop
        self.ipakcb = ipakcb
        self.extension = extension
        self.unitnumber = unitnumber
        self.filenames = filenames
        self.external = external

    def to_dict(self) -> dict:
        return {
            'surf': self.stress_period_data.get_surface_elevation_sp_data(),
            'evtr': self.stress_period_data.get_evapotranspiration_sp_data(),
            'exdp': self.stress_period_data.get_extinction_depth_sp_data(),
            'ievt': self.stress_period_data.get_layer_index_sp_data(),
            'nevtop': self.nevtop,
            'ipakcb': self.ipakcb,
            'extension': self.extension,
            'unitnumber': self.unitnumber,
            'filenames': self.filenames,
            'external': self.external,
        }


def calculate_evt_package_data(modflow_model: ModflowModel) -> EvtPackageData | None:
    stress_period_data = calculate_stress_period_data(modflow_model)
    if stress_period_data is None:
        return None
    return EvtPackageData(stress_period_data=stress_period_data)


def create_evt_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowEvt | None:
    package_data = calculate_evt_package_data(modflow_model)
    if package_data is None:
        return None

    return FlopyModflowEvt(model=flopy_modflow, **package_data.to_dict())
