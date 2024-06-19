import dataclasses
from typing import Literal

from flopy.modflow import ModflowRch as FlopyModflowRch

from .RchPackageMapper import RchStressPeriodData, calculate_stress_period_data
from ...modflow_2005 import FlopyModflow
from morpheus.project.types.Model import Model


@dataclasses.dataclass
class RchPackageSettings:
    ipakcb: int

    def __init__(self, ipakcb: int = 0):
        self.ipakcb = ipakcb

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


@dataclasses.dataclass
class RchPackageData:
    stress_period_data: RchStressPeriodData
    ipakcb: int
    irch: int
    extension: Literal["rch"]
    unitnumber: None | int
    filenames: None | str | list[str]

    def __init__(self, stress_period_data: RchStressPeriodData, nrchop: int = 3, ipakcb=0, irch: int = 0,
                 extension: Literal["rch"] = "rch", unitnumber: int | None = None,
                 filenames: list[str] | str | None = None):
        self.stress_period_data = stress_period_data
        self.nrchop = nrchop
        self.ipakcb = ipakcb
        self.irch = irch
        self.extension = extension
        self.unitnumber = unitnumber
        self.filenames = filenames

    def to_dict(self) -> dict:
        return {
            'rech': self.stress_period_data.to_dict(),
            'nrchop': self.nrchop,
            'ipakcb': self.ipakcb,
            'irch': self.irch,
            'extension': self.extension,
            'unitnumber': self.unitnumber,
            'filenames': self.filenames,
        }


def calculate_rch_package_data(model: Model, settings: RchPackageSettings) -> RchPackageData | None:
    stress_period_data = calculate_stress_period_data(model)
    if stress_period_data is None:
        return None
    return RchPackageData(stress_period_data=stress_period_data, ipakcb=settings.ipakcb)


def create_rch_package(flopy_modflow: FlopyModflow, model: Model, settings: RchPackageSettings) -> FlopyModflowRch | None:
    package_data = calculate_rch_package_data(model=model, settings=settings)
    if package_data is None:
        return None

    return FlopyModflowRch(model=flopy_modflow, **package_data.to_dict())
