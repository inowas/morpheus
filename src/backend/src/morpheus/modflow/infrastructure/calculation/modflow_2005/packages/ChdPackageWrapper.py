import dataclasses
from flopy.modflow import ModflowChd as FlopyModflowChd

from .ChdPackageMapper import ChdStressPeriodData, calculate_stress_period_data
from ...modflow_2005 import FlopyModflow
from .....types.ModflowModel import ModflowModel


@dataclasses.dataclass
class ChdPackageData:
    stress_period_data: ChdStressPeriodData
    dtype: None | list = None
    options: None | list = None
    extension: str = "chd"
    unitnumber: None | int = None
    filenames: None | str | list[str] = None,

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


def calculate_chd_package_data(modflow_model: ModflowModel) -> ChdPackageData:
    stress_period_data = calculate_stress_period_data(modflow_model)
    return ChdPackageData(
        stress_period_data=stress_period_data,
        dtype=None,
        options=None,
        extension="chd",
        unitnumber=None,
        filenames=None,
    )


def create_chd_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowChd:
    chd_package_data = calculate_chd_package_data(modflow_model)
    return FlopyModflowChd(
        model=flopy_modflow,
        stress_period_data=chd_package_data.stress_period_data.to_dict(),
        dtype=chd_package_data.dtype,
        options=chd_package_data.options,
        extension=chd_package_data.extension,
        unitnumber=chd_package_data.unitnumber,
        filenames=chd_package_data.filenames,
    )
