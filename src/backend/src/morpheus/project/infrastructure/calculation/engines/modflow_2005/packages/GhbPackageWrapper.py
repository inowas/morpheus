import dataclasses
from typing import Literal

from flopy.modflow import ModflowGhb as FlopyModflowGhb

from .GhbPackageMapper import GhbStressPeriodData, calculate_stress_period_data
from ...modflow_2005 import FlopyModflow
from morpheus.project.types.Model import Model


@dataclasses.dataclass
class GhbPackageData:
    stress_period_data: GhbStressPeriodData
    ipakcb: int
    dtype: None | list
    no_print: bool
    options: None | list
    extension: Literal["ghb"]
    unitnumber: None | int
    filenames: None | str | list[str]

    def __init__(self, stress_period_data: GhbStressPeriodData, ipakcb=0, dtype: None | list = None,
                 no_print: bool = False, options: None | list = None, extension: Literal["ghb"] = "ghb",
                 unitnumber: int | None = None, filenames: list[str] | str | None = None):
        self.stress_period_data = stress_period_data
        self.ipakcb = ipakcb
        self.dtype = dtype
        self.no_print = no_print
        self.options = options
        self.extension = extension
        self.unitnumber = unitnumber
        self.filenames = filenames

    def to_dict(self) -> dict:
        return {
            "stress_period_data": self.stress_period_data.to_dict(),
            "ipakcb": self.ipakcb,
            "dtype": self.dtype,
            "no_print": self.no_print,
            "options": self.options,
            "extension": self.extension,
            "unitnumber": self.unitnumber,
            "filenames": self.filenames
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            stress_period_data=GhbStressPeriodData.from_dict(obj['stress_period_data']),
            ipakcb=obj['ipakcb'],
            dtype=obj['dtype'],
            no_print=obj['no_print'],
            options=obj['options'],
            extension=obj['extension'],
            unitnumber=obj['unitnumber'],
            filenames=obj['filenames']
        )


def calculate_ghb_package_data(model: Model) -> GhbPackageData | None:
    stress_period_data = calculate_stress_period_data(model)
    if stress_period_data is None:
        return None
    return GhbPackageData(stress_period_data=stress_period_data)


def create_ghb_package(flopy_modflow: FlopyModflow, model: Model) -> FlopyModflowGhb | None:
    package_data = calculate_ghb_package_data(model)
    if package_data is None:
        return None

    return FlopyModflowGhb(model=flopy_modflow, **package_data.to_dict())
