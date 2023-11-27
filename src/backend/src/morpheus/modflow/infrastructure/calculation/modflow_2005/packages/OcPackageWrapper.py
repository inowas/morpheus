import dataclasses
from typing import TypedDict

from flopy.modflow import ModflowOc as FlopyModflowOc

from morpheus.modflow.infrastructure.calculation.modflow_2005 import FlopyModflow
from morpheus.modflow.types.ModflowModel import ModflowModel


@dataclasses.dataclass
class StressPeriodData(TypedDict):
    data: list[(int, int), list[str]]


@dataclasses.dataclass
class OcPackageData:
    ihedfm: int = 0,
    iddnfm: int = 0,
    chedfm: str | None = None,
    cddnfm: str | None = None,
    cboufm: str | None = None,
    compact: bool = True,
    stress_period_data: StressPeriodData | None = None,
    extension: list[str] = ["oc", "hds", "ddn", "cbc", "ibo"],
    unitnumber: list[int] | None = [14, 51, 52, 53, 0],
    filenames: list[str] | str | None = None,
    label: str = "LABEL",

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)


def calculate_oc_package_data(modflow_model: ModflowModel) -> OcPackageData:
    oc_package_data = OcPackageData()
    return oc_package_data


def create_oc_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowOc:
    oc_package_data = calculate_oc_package_data(modflow_model)
    return FlopyModflowOc(
        model=flopy_modflow,
        ihedfm=oc_package_data.ihedfm,
        iddnfm=oc_package_data.iddnfm,
        chedfm=oc_package_data.chedfm,
        cddnfm=oc_package_data.cddnfm,
        cboufm=oc_package_data.cboufm,
        compact=oc_package_data.compact,
        stress_period_data=oc_package_data.stress_period_data,
        extension=oc_package_data.extension,
        unitnumber=oc_package_data.unitnumber,
        filenames=oc_package_data.filenames,
        label=oc_package_data.label,
    )
