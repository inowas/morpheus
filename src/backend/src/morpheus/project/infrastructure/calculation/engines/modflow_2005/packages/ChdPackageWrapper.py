import dataclasses
from flopy.modflow import ModflowChd as FlopyModflowChd

from .ChdPackageMapper import ChdStressPeriodData, calculate_stress_period_data
from ...modflow_2005 import FlopyModflow
from morpheus.project.types.Model import Model


@dataclasses.dataclass
class ChdPackageSettings:

    def __init__(self):
        pass

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls()

    def to_dict(self) -> dict:
        return {}


@dataclasses.dataclass
class ChdPackageData:
    stress_period_data: ChdStressPeriodData
    dtype: None | list
    options: None | list
    extension: str
    unitnumber: None | int
    filenames: None | str | list[str]

    def __init__(self, stress_period_data: ChdStressPeriodData, dtype: None | list = None, options: None | list = None,
                 extension="chd", unitnumber: int | None = None, filenames: list[str] | str | None = None):
        self.stress_period_data = stress_period_data
        self.dtype = dtype
        self.options = options
        self.extension = extension
        self.unitnumber = unitnumber
        self.filenames = filenames

    def to_dict(self) -> dict:
        return {
            'stress_period_data': self.stress_period_data.to_dict(),
            'dtype': self.dtype,
            'options': self.options,
            'extension': self.extension,
            'unitnumber': self.unitnumber,
            'filenames': self.filenames,
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)


def calculate_chd_package_data(model: Model, settings: ChdPackageSettings) -> ChdPackageData | None:
    stress_period_data = calculate_stress_period_data(model)
    if stress_period_data is None:
        return None
    return ChdPackageData(stress_period_data=stress_period_data)


def create_chd_package(flopy_modflow: FlopyModflow, model: Model, settings: ChdPackageSettings) -> FlopyModflowChd | None:
    package_data = calculate_chd_package_data(model=model, settings=settings)
    if package_data is None:
        return None

    return FlopyModflowChd(model=flopy_modflow, **package_data.to_dict())
