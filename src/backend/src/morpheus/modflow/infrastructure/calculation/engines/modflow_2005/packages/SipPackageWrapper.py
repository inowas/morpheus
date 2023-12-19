import dataclasses

from flopy.modflow import ModflowSip as FlopyModflowSip
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005 import FlopyModflow


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

    def __init__(self, mxiter=200, nparm=5, accl=1, hclose=1e-5, ipcalc=1, wseed=0, iprsip=0, extension: str = "sip",
                 unitnumber=None, filenames=None):
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


def create_sip_package(flopy_modflow: FlopyModflow, package_data: SipPackageData) -> FlopyModflowSip:
    return FlopyModflowSip(model=flopy_modflow, **package_data.to_dict())
