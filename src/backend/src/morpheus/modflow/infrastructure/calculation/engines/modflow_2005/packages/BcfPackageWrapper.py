import dataclasses
from flopy.modflow import ModflowBcf as FlopyModflowBcf

from morpheus.modflow.infrastructure.calculation.engines.modflow_2005 import FlopyModflow
from morpheus.modflow.types.ModflowModel import ModflowModel


@dataclasses.dataclass
class BcfPackageData:
    ipakcb: int | None
    intercellt: list[int] | int
    laycon: list[int] | int
    trpy: list[float] | float
    hdry: float
    iwdflg: int
    wetfct: float
    iwetit: int
    ihdwet: int
    tran: list[list[list[float]]] | float
    hy: list[list[list[float]]] | float
    vcont: list[list[list[float]]] | float
    sf1: list[list[list[float]]] | float
    sf2: list[list[list[float]]] | float
    wetdry: float
    extension: str
    unitnumber: int | None
    filenames: list[str] | str | None
    add_package: bool

    def __init__(self, ipakcb: int | None = None, intercellt: list[int] | int = 0, laycon: list[int] | int = 3,
                 trpy: list[float] | float = 1.0, hdry: float = -1e+30, iwdflg: int = 0, wetfct: float = 0.1,
                 iwetit: int = 1, ihdwet: int = 0, tran: list[list[list[float]]] | float = 1.0,
                 hy: list[list[list[float]]] | float = 1.0, vcont: list[list[list[float]]] | float = 1.0,
                 sf1: list[list[list[float]]] | float = 1e-5, sf2: list[list[list[float]]] | float = 0.15,
                 wetdry: float = -0.01, extension: str = "bcf", unitnumber: int | None = None,
                 filenames: list[str] | str | None = None, add_package: bool = True):
        self.ipakcb = ipakcb
        self.intercellt = intercellt
        self.laycon = laycon
        self.trpy = trpy
        self.hdry = hdry
        self.iwdflg = iwdflg
        self.wetfct = wetfct
        self.iwetit = iwetit
        self.ihdwet = ihdwet
        self.tran = tran
        self.hy = hy
        self.vcont = vcont
        self.sf1 = sf1
        self.sf2 = sf2
        self.wetdry = wetdry
        self.extension = extension
        self.unitnumber = unitnumber
        self.filenames = filenames
        self.add_package = add_package

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> "BcfPackageData":
        return cls(**data)

    @classmethod
    def default(cls):
        return cls()


def calculate_bcf_package_data(modflow_model: ModflowModel) -> BcfPackageData:
    transmissivity = []
    bottoms = modflow_model.soil_model.bottoms()
    for layer_idx, layer in enumerate(modflow_model.soil_model):
        if layer_idx == 0:
            transmissivity.append(layer.data.get_transmissivity(layer.data.top))
            continue

        transmissivity.append(layer.data.get_transmissivity(bottoms[layer_idx - 1]))

    bcf_package_data = BcfPackageData(
        ipakcb=None,
        intercellt=[layer.data.get_layer_average() for layer in modflow_model.soil_model],
        laycon=[0 if layer.is_confined() else 1 for layer in modflow_model.soil_model],
        trpy=[layer.data.get_horizontal_anisotropy() for layer in modflow_model.soil_model],
        hdry=-1e+30,
        iwdflg=any([layer.data.is_wetting_active() for layer in modflow_model.soil_model]),
        wetfct=0.1,
        iwetit=1,
        ihdwet=0,
        tran=[layer.data.get_transmissivity() for layer in modflow_model.soil_model],
        hy=1.0,
        vcont=1.0,
        sf1=1e-5,
        sf2=0.15,
        wetdry=-0.01,
        extension="bcf",
        unitnumber=None,
        filenames=None,
        add_package=True
    )
    return bcf_package_data


def create_bcf_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowBcf:
    package_data = calculate_bcf_package_data(modflow_model)
    return FlopyModflowBcf(model=flopy_modflow, **package_data.to_dict())
