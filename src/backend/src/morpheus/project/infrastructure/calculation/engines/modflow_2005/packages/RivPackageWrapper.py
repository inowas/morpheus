import dataclasses
from typing import Literal

from flopy.modflow import ModflowRiv as FlopyModflowRiv

from morpheus.project.types.Model import Model

from ...modflow_2005 import FlopyModflow
from .RivPackageMapper import RivStressPeriodData, calculate_stress_period_data


@dataclasses.dataclass
class RivPackageSettings:
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
class RivPackageData:
    stress_period_data: RivStressPeriodData
    ipakcb: int
    dtype: None | list
    options: None | list
    extension: Literal['riv']
    unitnumber: None | int
    filenames: None | str | list[str]

    def __init__(
        self,
        stress_period_data: RivStressPeriodData,
        ipakcb=0,
        dtype: None | list = None,
        options: None | list = None,
        extension: Literal['riv'] = 'riv',
        unitnumber: int | None = None,
        filenames: list[str] | str | None = None,
    ):
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
        return cls(
            stress_period_data=RivStressPeriodData.from_dict(obj['stress_period_data']),
            ipakcb=obj['ipakcb'],
            dtype=obj['dtype'],
            options=obj['options'],
            extension=obj['extension'],
            unitnumber=obj['unitnumber'],
            filenames=obj['filenames'],
        )


def calculate_riv_package_data(model: Model, settings: RivPackageSettings) -> RivPackageData | None:
    stress_period_data = calculate_stress_period_data(model)
    if stress_period_data is None:
        return None
    return RivPackageData(stress_period_data=stress_period_data, ipakcb=settings.ipakcb)


def create_riv_package(flopy_modflow: FlopyModflow, model: Model, settings: RivPackageSettings) -> FlopyModflowRiv | None:
    package_data = calculate_riv_package_data(model=model, settings=settings)
    if package_data is None:
        return None

    return FlopyModflowRiv(model=flopy_modflow, **package_data.to_dict())
