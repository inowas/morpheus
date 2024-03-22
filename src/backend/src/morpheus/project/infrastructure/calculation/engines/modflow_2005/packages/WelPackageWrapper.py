import dataclasses
from typing import Literal

from flopy.modflow import ModflowWel as FlopyModflowWel

from .WelPackageMapper import WelStressPeriodData, calculate_stress_period_data
from ...modflow_2005 import FlopyModflow
from morpheus.project.types.Model import Model


@dataclasses.dataclass
class WelPackageData:
    stress_period_data: WelStressPeriodData
    ipakcb: int
    dtype: None | list
    options: None | list
    binary: bool
    extension: Literal["wel"]
    unitnumber: None | int
    filenames: None | str | list[str]
    add_package: bool

    def __init__(self, stress_period_data: WelStressPeriodData, ipakcb=0, dtype: None | list = None,
                 options: None | list = None, binary: bool = False, extension: Literal["wel"] = "wel",
                 unitnumber: int | None = None, filenames: list[str] | str | None = None, add_package: bool = True):
        self.stress_period_data = stress_period_data
        self.ipakcb = ipakcb
        self.dtype = dtype
        self.options = options
        self.binary = binary
        self.extension = extension
        self.unitnumber = unitnumber
        self.filenames = filenames
        self.add_package = add_package

    def to_dict(self) -> dict:
        return {
            "stress_period_data": self.stress_period_data.to_dict(),
            "ipakcb": self.ipakcb,
            "dtype": self.dtype,
            "options": self.options,
            "binary": self.binary,
            "extension": self.extension,
            "unitnumber": self.unitnumber,
            "filenames": self.filenames,
            "add_package": self.add_package
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            stress_period_data=WelStressPeriodData.from_dict(obj['stress_period_data']),
            ipakcb=obj['ipakcb'],
            dtype=obj['dtype'],
            options=obj['options'],
            binary=obj['binary'],
            extension=obj['extension'],
            unitnumber=obj['unitnumber'],
            filenames=obj['filenames'],
            add_package=obj['add_package']
        )


def calculate_wel_package_data(model: Model) -> WelPackageData | None:
    stress_period_data = calculate_stress_period_data(model)
    if stress_period_data is None:
        return None
    return WelPackageData(stress_period_data=stress_period_data)


def create_wel_package(flopy_modflow: FlopyModflow, model: Model) -> FlopyModflowWel | None:
    package_data = calculate_wel_package_data(model)
    if package_data is None:
        return None

    return FlopyModflowWel(model=flopy_modflow, **package_data.to_dict())
