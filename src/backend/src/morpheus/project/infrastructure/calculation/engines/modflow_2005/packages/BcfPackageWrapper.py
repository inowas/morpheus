import dataclasses
import numpy as np
from flopy.modflow import ModflowBcf as FlopyModflowBcf

from morpheus.project.infrastructure.calculation.engines.modflow_2005 import FlopyModflow
from morpheus.project.types.Model import Model


@dataclasses.dataclass
class BcfPackageSettings:
    ipakcb: int
    iwdflg: int
    ihdwet: int
    wetfct: float
    iwetit: int
    wetdry: float
    hdry: float

    def __init__(self, ipakcb: int = 0, iwdflg: int = 0, ihdwet: int = 0, wetfct: float = 0.1, iwetit: int = 1, wetdry: float = -0.01, hdry: float = -1e30):
        self.ipakcb = ipakcb
        self.iwdflg = iwdflg
        self.ihdwet = ihdwet
        self.wetfct = wetfct
        self.iwetit = iwetit
        self.wetdry = wetdry
        self.hdry = hdry

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


@dataclasses.dataclass
class BcfPackageData:
    ipakcb: int
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

    def __init__(self, ipakcb: int = 0, intercellt: list[int] | int = 0, laycon: list[int] | int = 3,
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


def calculate_bcf_package_data(model: Model, settings: BcfPackageSettings) -> BcfPackageData:
    transmissivity = []
    for layer_idx, layer in enumerate(model.layers):
        if layer_idx == 0:
            top = layer.properties.top
            if top is None:
                raise ValueError("Top of first layer is not set")
            transmissivity.append(layer.properties.get_transmissivity(top).get_data())
            continue

        transmissivity.append(layer.properties.get_transmissivity(model.layers.layers[layer_idx - 1].properties.bottom).get_data())

    bcf_package_data = BcfPackageData(
        ipakcb=settings.ipakcb,
        intercellt=[layer.properties.get_layer_average() for layer in model.layers],
        laycon=[0 if layer.is_confined() else 1 for layer in model.layers],
        trpy=[np.array(layer.properties.get_horizontal_anisotropy()).mean() for layer in model.layers],
        hdry=settings.hdry,
        iwdflg=settings.iwdflg,
        wetfct=settings.wetfct,
        iwetit=settings.iwetit,
        ihdwet=settings.ihdwet,
        tran=transmissivity,
        hy=1.0,
        vcont=1.0,
        sf1=1e-5,
        sf2=0.15,
        wetdry=settings.wetdry,
        extension="bcf",
        unitnumber=None,
        filenames=None,
        add_package=True
    )
    return bcf_package_data


def create_bcf_package(flopy_modflow: FlopyModflow, model: Model, settings: BcfPackageSettings) -> FlopyModflowBcf:
    package_data = calculate_bcf_package_data(model=model, settings=settings)
    return FlopyModflowBcf(model=flopy_modflow, **package_data.to_dict())
