import dataclasses

from flopy.modflow import ModflowPcg as FlopyModflowPcg

from morpheus.modflow.infrastructure.calculation.modflow_2005 import FlopyModflow


@dataclasses.dataclass
class PcgPackageData:
    mxiter: int
    iter1: int
    npcond: int
    hclose: float
    rclose: float
    relax: float
    nbpol: int
    iprpcg: int
    mutpcg: int
    damp: float
    dampt: float
    ihcofadd: int
    extension: str
    unitnumber: int | None
    filenames: list[str] | str | None

    def __init__(self, mxiter: int = 50, iter1: int = 30, npcond: int = 1, hclose: float = 1e-5,
                 rclose: float = 1e-5, relax: float = 1.0, nbpol: int = 0, iprpcg: int = 0, mutpcg: int = 3,
                 damp: float = 1.0, dampt: float = 1.0, ihcofadd: int = 0, extension: str = "pcg",
                 unitnumber: int | None = None, filenames: list[str] | str | None = None):
        self.mxiter = mxiter
        self.iter1 = iter1
        self.npcond = npcond
        self.hclose = hclose
        self.rclose = rclose
        self.relax = relax
        self.nbpol = nbpol
        self.iprpcg = iprpcg
        self.mutpcg = mutpcg
        self.damp = damp
        self.dampt = dampt
        self.ihcofadd = ihcofadd
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


def create_pcg_package(flopy_modflow: FlopyModflow, package_data: PcgPackageData) -> FlopyModflowPcg:
    return FlopyModflowPcg(model=flopy_modflow, **package_data.to_dict())
