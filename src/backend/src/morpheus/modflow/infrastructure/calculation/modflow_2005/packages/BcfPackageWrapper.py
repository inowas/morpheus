import dataclasses
from flopy.modflow import ModflowBcf as FlopyModflowBcf

from morpheus.modflow.infrastructure.calculation.modflow_2005 import FlopyModflow
from morpheus.modflow.types.ModflowModel import ModflowModel


@dataclasses.dataclass
class BcfPackageData:
    ipakcb: int | None = None,
    intercellt: int = 0,
    laycon: list[int] | int = 3,
    trpy: list[float] | float = 1.0,
    hdry: float = -1e30,
    iwdflg: int = 0,
    wetfct: float = 0.1,
    iwetit: int = 1,
    ihdwet: int = 0,
    tran: list[list[list[float]]] | float = 1.0,
    hy: list[list[list[float]]] | float = 1.0,
    vcont: list[list[list[float]]] | float = 1.0,
    sf1: list[list[list[float]]] | float = 1e-5,
    sf2: list[list[list[float]]] | float = 0.15,
    wetdry: float = -0.01,
    extension: str = "bcf",
    unitnumber: int | None = None,
    filenames: list[str] | str | None = None,
    add_package: bool = True,

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> "BcfPackageData":
        return cls(**data)


def calculate_bcf_package_data(modflow_model: ModflowModel) -> BcfPackageData:
    bcf_package_data = BcfPackageData()
    return bcf_package_data


def create_bcf_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowBcf:
    bcf_package_data = calculate_bcf_package_data(modflow_model)
    return FlopyModflowBcf(
        model=flopy_modflow,
        ipakcb=bcf_package_data.ipakcb,
        intercellt=bcf_package_data.intercellt,
        laycon=bcf_package_data.laycon,
        trpy=bcf_package_data.trpy,
        hdry=bcf_package_data.hdry,
        iwdflg=bcf_package_data.iwdflg,
        wetfct=bcf_package_data.wetfct,
        iwetit=bcf_package_data.iwetit,
        ihdwet=bcf_package_data.ihdwet,
        tran=bcf_package_data.tran,
        hy=bcf_package_data.hy,
        vcont=bcf_package_data.vcont,
        sf1=bcf_package_data.sf1,
        sf2=bcf_package_data.sf2,
        wetdry=bcf_package_data.wetdry,
        extension=bcf_package_data.extension,
        unitnumber=bcf_package_data.unitnumber,
        filenames=bcf_package_data.filenames,
        add_package=bcf_package_data.add_package,
    )
