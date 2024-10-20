import dataclasses

from flopy.modflow import ModflowSip as FlopyModflowSip
from morpheus.project.infrastructure.calculation.engines.modflow_2005 import FlopyModflow
from morpheus.project.types.Model import Model


@dataclasses.dataclass
class SipPackageSettings:
    mxiter: int
    nparm: int
    accl: float
    hclose: float
    ipcalc: int
    wseed: float
    iprsip: int

    def __init__(self, mxiter: int = 200, nparm: int = 5, accl: float = 1, hclose: float = 1e-5,
                 ipcalc: int = 1, wseed: float = 0.0, iprsip: int = 0):
        self.mxiter = mxiter
        self.nparm = nparm
        self.accl = accl
        self.hclose = hclose
        self.ipcalc = ipcalc
        self.wseed = wseed
        self.iprsip = iprsip

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)


@dataclasses.dataclass
class SipPackageData:
    mxiter: int
    nparm: int
    accl: float
    hclose: float
    ipcalc: int
    wseed: float
    iprsip: int
    extension: str
    unitnumber: int | None
    filenames: list[str] | str | None

    def __init__(self, mxiter=200, nparm=5, accl=1, hclose=1e-5, ipcalc=1, wseed=0, iprsip=0, extension: str = "sip", unitnumber=None, filenames=None):
        self.mxiter = mxiter
        self.nparm = nparm
        self.accl = accl
        self.hclose = hclose
        self.ipcalc = ipcalc
        self.wseed = wseed
        self.iprsip = iprsip
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


def create_sip_package(flopy_modflow: FlopyModflow, model: Model, settings: SipPackageSettings) -> FlopyModflowSip:
    package_data = SipPackageData(**settings.to_dict())
    return FlopyModflowSip(model=flopy_modflow, **package_data.to_dict())
