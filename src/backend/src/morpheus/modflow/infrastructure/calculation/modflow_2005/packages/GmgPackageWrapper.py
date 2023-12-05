import dataclasses

from flopy.modflow import ModflowGmg as FlopyModflowGmg
from morpheus.modflow.infrastructure.calculation.modflow_2005 import FlopyModflow


@dataclasses.dataclass
class GmgPackageData:
    mxiter: int
    iiter: int
    iadamp: int
    hclose: float
    rclose: float
    relax: float
    ioutgmg: int
    iunitmhc: int
    ism: int
    isc: int
    damp: float
    dup: float
    dlow: float
    chglimit: float
    extension: str
    unitnumber: int | None
    filenames: list[str] | str | None

    def __init__(self, mxiter=50, iiter=30, iadamp=0, hclose=1e-5, rclose=1e-5, relax=1.0, ioutgmg=0,
                 iunitmhc=0, ism=0, isc=0, damp=1.0, dup=0.75, dlow=0.01, chglimit=1.0, extension="gmg",
                 unitnumber: int | None = None, filenames: list[str] | str | None = None):
        self.mxiter = mxiter
        self.iiter = iiter
        self.iadamp = iadamp
        self.hclose = hclose
        self.rclose = rclose
        self.relax = relax
        self.ioutgmg = ioutgmg
        self.iunitmhc = iunitmhc
        self.ism = ism
        self.isc = isc
        self.damp = damp
        self.dup = dup
        self.dlow = dlow
        self.chglimit = chglimit
        self.extension = extension
        self.unitnumber = unitnumber
        self.filenames = filenames

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)


def create_gmg_package(flopy_modflow: FlopyModflow, package_data: GmgPackageData) -> FlopyModflowGmg:
    return FlopyModflowGmg(model=flopy_modflow, **package_data.to_dict())
