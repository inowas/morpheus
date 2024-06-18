import dataclasses

from flopy.modflow import ModflowDe4 as FlopyModflowDe4

from morpheus.project.infrastructure.calculation.engines.modflow_2005 import FlopyModflow
from morpheus.project.types.Model import Model


@dataclasses.dataclass
class De4PackageSettings:

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
class De4PackageData:
    itmx: int
    mxup: int
    mxlow: int
    mxbw: int
    ifreq: int
    mutd4: int
    accl: int
    hclose: float
    iprd4: int
    extension: str
    unitnumber: int | None
    filenames: list[str] | str | None

    def __init__(self, itmx=50, mxup=0, mxlow=0, mxbw=0, ifreq=3, mutd4=0, accl=1, hclose=1e-5, iprd4=1,
                 extension="de4", unitnumber: int | None = None, filenames: list[str] | str | None = None):
        self.itmx = itmx
        self.mxup = mxup
        self.mxlow = mxlow
        self.mxbw = mxbw
        self.ifreq = ifreq
        self.mutd4 = mutd4
        self.accl = accl
        self.hclose = hclose
        self.iprd4 = iprd4
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


def create_de4_package(flopy_modflow: FlopyModflow, model: Model, settings: De4PackageSettings) -> FlopyModflowDe4:
    package_data = De4PackageData(**settings.to_dict())
    return FlopyModflowDe4(model=flopy_modflow, **package_data.to_dict())
