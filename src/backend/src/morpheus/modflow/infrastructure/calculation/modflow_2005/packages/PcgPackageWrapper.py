import dataclasses

from flopy.modflow import ModflowPcg as FlopyModflowPcg

from morpheus.modflow.infrastructure.calculation.modflow_2005 import FlopyModflow
from morpheus.modflow.types.ModflowModel import ModflowModel


@dataclasses.dataclass
class PcgPackageData:
    mxiter: int = 50,
    iter1: int = 30,
    npcond: int = 1,
    hclose: float = 1e-5,
    rclose: float = 1e-5,
    relax: float = 1.0,
    nbpol: int = 0,
    iprpcg: int = 0,
    mutpcg: int = 3,
    damp: float = 1.0,
    dampt: float = 1.0,
    ihcofadd: int = 0,
    extension: str = "pcg",
    unitnumber: int | None = None,
    filenames: list[str] | str | None = None,

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)


def calculate_pcg_package_data(modflow_model: ModflowModel) -> PcgPackageData:
    pcg_package_data = PcgPackageData()
    return pcg_package_data


def create_pcg_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowPcg:
    pcg_package_data = calculate_pcg_package_data(modflow_model)
    return FlopyModflowPcg(
        model=flopy_modflow,
        mxiter=pcg_package_data.mxiter,
        iter1=pcg_package_data.iter1,
        npcond=pcg_package_data.npcond,
        hclose=pcg_package_data.hclose,
        rclose=pcg_package_data.rclose,
        relax=pcg_package_data.relax,
        nbpol=pcg_package_data.nbpol,
        iprpcg=pcg_package_data.iprpcg,
        mutpcg=pcg_package_data.mutpcg,
        damp=pcg_package_data.damp,
        dampt=pcg_package_data.dampt,
        ihcofadd=pcg_package_data.ihcofadd,
        extension=pcg_package_data.extension,
        unitnumber=pcg_package_data.unitnumber,
        filenames=pcg_package_data.filenames,
    )
