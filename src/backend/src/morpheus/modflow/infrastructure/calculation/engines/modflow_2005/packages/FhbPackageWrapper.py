import dataclasses
from typing import Literal

from flopy.modflow import ModflowFhb as FlopyModflowFhb

from .FhbPackageMapper import FhbStressPeriodData, calculate_fhb_boundary_stress_period_data
from ...modflow_2005 import FlopyModflow
from morpheus.modflow.types.ModflowModel import ModflowModel


@dataclasses.dataclass
class FhbPackageData:
    nbdtim: int
    nflw: int
    nhed: int
    ifhbss: int
    ipakcb: None | int
    nfhbx1: int
    nfhbx2: int
    ifhbpt: int
    bdtimecnstm: float
    bdtime: list[float]
    cnstm5: float
    ds5: list[list[float]] | None
    cnstm7: float
    ds7: list[list[float]] | None
    extension: Literal["fhb"] = "fhb"
    unitnumber: int | None = None
    filenames: list[str] | str | None = None

    def __init__(self,
                 fhb_stress_period_data: FhbStressPeriodData,
                 ifhbss: int = 0,
                 ipakcb: None | int = None,
                 ifhbpt: int = 0,
                 bdtimecnstm: float = 0.0,
                 cnstm5: float = 1.0,
                 cnstm7: float = 1.0,
                 extension: Literal["fhb"] = "fhb",
                 unitnumber: int | None = None,
                 filenames: list[str] | str | None = None):

        ds5 = fhb_stress_period_data.get_ds5()
        ds7 = fhb_stress_period_data.get_ds7()

        self.nbdtim = len(fhb_stress_period_data.total_times)
        self.nflw = len(ds5)
        self.nhed = len(ds7)
        self.ifhbss = ifhbss
        self.ipakcb = ipakcb
        self.nfhbx1 = 0
        self.nfhbx2 = 0
        self.ifhbpt = ifhbpt
        self.bdtimecnstm = bdtimecnstm
        self.bdtime = fhb_stress_period_data.total_times
        self.cnstm5 = cnstm5
        self.ds5 = ds5 if len(ds5) > 0 else None
        self.cnstm7 = cnstm7
        self.ds7 = ds7 if len(ds7) > 0 else None
        self.extension = extension
        self.unitnumber = unitnumber
        self.filenames = filenames

    def to_dict(self):
        return {
            'nbdtim': self.nbdtim,
            'nflw': self.nflw,
            'nhed': self.nhed,
            'ifhbss': self.ifhbss,
            'ipakcb': self.ipakcb,
            'nfhbx1': self.nfhbx1,
            'nfhbx2': self.nfhbx2,
            'ifhbpt': self.ifhbpt,
            'bdtimecnstm': self.bdtimecnstm,
            'bdtime': self.bdtime,
            'cnstm5': self.cnstm5,
            'ds5': self.ds5,
            'cnstm7': self.cnstm7,
            'ds7': self.ds7,
            'extension': self.extension,
            'unitnumber': self.unitnumber,
            'filenames': self.filenames
        }


def calculate_fhb_package_data(modflow_model: ModflowModel) -> FhbPackageData | None:
    fhb_stress_period_data = calculate_fhb_boundary_stress_period_data(modflow_model)
    if fhb_stress_period_data is None:
        return None

    return FhbPackageData(fhb_stress_period_data=fhb_stress_period_data)


def create_fhb_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowFhb | None:
    package_data = calculate_fhb_package_data(modflow_model)
    if package_data is None:
        return None

    return FlopyModflowFhb(model=flopy_modflow, **package_data.to_dict())
