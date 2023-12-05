import dataclasses
from typing import TypedDict

from flopy.modflow import ModflowOc as FlopyModflowOc

from morpheus.modflow.infrastructure.calculation.modflow_2005 import FlopyModflow


@dataclasses.dataclass
class StressPeriodData(TypedDict):
    data: list[(int, int), list[str]]


@dataclasses.dataclass
class OcPackageData:
    ihedfm: int
    iddnfm: int
    chedfm: str | None
    cddnfm: str | None
    cboufm: str | None
    compact: bool
    stress_period_data: StressPeriodData | None
    extension: list[str] | None
    unitnumber: list[int] | None
    filenames: list[str] | str | None
    label: str

    def __init__(self, ihedfm: int = 0, iddnfm: int = 0, chedfm: str | None = None, cddnfm: str | None = None,
                 cboufm: str | None = None, compact: bool = True, stress_period_data: StressPeriodData | None = None,
                 extension: list[str] | None = None, unitnumber: list[int] | None = None,
                 filenames: list[str] | str | None = None, label: str = "OC"):
        self.ihedfm = ihedfm
        self.iddnfm = iddnfm
        self.chedfm = chedfm
        self.cddnfm = cddnfm
        self.cboufm = cboufm
        self.compact = compact
        self.stress_period_data = stress_period_data
        self.extension = ['oc', 'hds', 'ddn', 'cbc', 'ibo'] if extension is None else extension
        self.unitnumber = unitnumber
        self.filenames = filenames
        self.label = label

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


def create_oc_package(flopy_modflow: FlopyModflow, oc_package: OcPackageData) -> FlopyModflowOc:
    return FlopyModflowOc(model=flopy_modflow, **oc_package.to_dict())
