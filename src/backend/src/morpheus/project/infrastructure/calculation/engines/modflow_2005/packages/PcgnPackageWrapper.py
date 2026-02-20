import dataclasses

from flopy.modflow import ModflowPcgn as FlopyModflowPcgn

from morpheus.project.infrastructure.calculation.engines.modflow_2005 import FlopyModflow
from morpheus.project.types.Model import Model


@dataclasses.dataclass
class PcgnPackageSettings:
    iter_mo: int
    iter_mi: int
    close_r: float
    close_h: float
    relax: float
    ifill: int
    unit_pc: int
    unit_ts: int
    adamp: int
    damp: float
    damp_lb: float
    rate_d: float
    chglimit: float
    acnvg: int
    cnvg_lb: float
    mcnvg: int
    rate_c: float
    ipunit: int

    def __init__(
        self,
        iter_mo=50,
        iter_mi=30,
        close_r=1e-5,
        close_h=1e-5,
        relax=1.0,
        ifill=0,
        unit_pc=0,
        unit_ts=0,
        adamp=0,
        damp=1.0,
        damp_lb=0.001,
        rate_d=0.1,
        chglimit=0.0,
        acnvg=0,
        cnvg_lb=0.001,
        mcnvg=2,
        rate_c=-1.0,
        ipunit=0,
    ):
        self.iter_mo = iter_mo
        self.iter_mi = iter_mi
        self.close_r = close_r

        self.close_h = close_h
        self.relax = relax
        self.ifill = ifill
        self.unit_pc = unit_pc
        self.unit_ts = unit_ts
        self.adamp = adamp
        self.damp = damp
        self.damp_lb = damp_lb
        self.rate_d = rate_d
        self.chglimit = chglimit
        self.acnvg = acnvg

        self.cnvg_lb = cnvg_lb
        self.mcnvg = mcnvg
        self.rate_c = rate_c
        self.ipunit = ipunit

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)


@dataclasses.dataclass
class PcgnPackageData:
    iter_mo: int
    iter_mi: int
    close_r: float
    close_h: float
    relax: float
    ifill: int
    unit_pc: int
    unit_ts: int
    adamp: int
    damp: float
    damp_lb: float
    rate_d: float
    chglimit: float
    acnvg: int
    cnvg_lb: float
    mcnvg: int
    rate_c: float
    ipunit: int
    extension: str
    unitnumber: int | None
    filenames: list[str] | str | None

    def __init__(
        self,
        iter_mo=50,
        iter_mi=30,
        close_r=1e-5,
        close_h=1e-5,
        relax=1.0,
        ifill=0,
        unit_pc=0,
        unit_ts=0,
        adamp=0,
        damp=1.0,
        damp_lb=0.001,
        rate_d=0.1,
        chglimit=0.0,
        acnvg=0,
        cnvg_lb=0.001,
        mcnvg=2,
        rate_c=-1.0,
        ipunit=0,
        extension='pcgn',
        unitnumber: int | None = None,
        filenames: list[str] | str | None = None,
    ):
        self.iter_mo = iter_mo
        self.iter_mi = iter_mi
        self.close_r = close_r

        self.close_h = close_h
        self.relax = relax
        self.ifill = ifill
        self.unit_pc = unit_pc
        self.unit_ts = unit_ts
        self.adamp = adamp
        self.damp = damp
        self.damp_lb = damp_lb
        self.rate_d = rate_d
        self.chglimit = chglimit
        self.acnvg = acnvg

        self.cnvg_lb = cnvg_lb
        self.mcnvg = mcnvg
        self.rate_c = rate_c
        self.ipunit = ipunit
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


def create_pcgn_package(flopy_modflow: FlopyModflow, model: Model, settings: PcgnPackageSettings) -> FlopyModflowPcgn:
    package_data = PcgnPackageData(**settings.to_dict())
    return FlopyModflowPcgn(model=flopy_modflow, **package_data.to_dict())
