import dataclasses
from flopy.modflow import ModflowLpf as FlopyModflowLpf

from morpheus.project.infrastructure.calculation.engines.modflow_2005 import FlopyModflow
from morpheus.project.types.Model import Model
from morpheus.project.types.layers.Layer import LayerConfinement


@dataclasses.dataclass
class LpfPackageSettings:
    ipakcb: int
    iwdflg: int | list[int]
    ihdwet: int
    wetfct: float
    iwetit: int
    wetdry: float | list[float | list[list[float]]]
    hdry: float
    storagecoefficient: bool
    nocvcorrection: bool
    constantcv: bool
    novfc: bool
    thickstrt: bool

    def __init__(self, ipakcb: int = 0, hdry: float = -1e30, iwdflg: int | list[int] = 0, wetfct: float = 0.1, iwetit: int = 1,
                 ihdwet: int = 0, wetdry: float | list[float | list[list[float]]] = -0.01, storagecoefficient: bool = False, constantcv: bool = False, thickstrt: bool = False,
                 nocvcorrection: bool = False, novfc: bool = False):
        self.ipakcb = ipakcb
        self.iwdflg = iwdflg
        self.ihdwet = ihdwet
        self.wetfct = wetfct
        self.iwetit = iwetit
        self.wetdry = wetdry
        self.hdry = hdry
        self.storagecoefficient = storagecoefficient
        self.nocvcorrection = nocvcorrection
        self.constantcv = constantcv
        self.novfc = novfc
        self.thickstrt = thickstrt

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


@dataclasses.dataclass
class LpfPackageData:
    laytyp: int | list[int]
    layavg: int | list[int]
    chani: float | list[float]
    layvka: int | list[int]
    laywet: int | list[int]
    ipakcb: int | None
    hdry: float
    iwdflg: int | list[int]
    wetfct: float
    iwetit: int
    ihdwet: int
    hk: list[float | list[list[float]]] | float
    hani: list[float | list[list[float]]] | float
    vka: list[float | list[list[float]]] | float
    ss: list[float | list[list[float]]] | float
    sy: list[float | list[list[float]]] | float
    vkcb: list[float | list[list[float]]] | float
    wetdry: list[float | list[list[float]]] | float
    storagecoefficient: bool
    constantcv: bool
    thickstrt: bool
    nocvcorrection: bool
    novfc: bool
    extension: str
    unitnumber: int | None
    filenames: str | list[str] | None
    add_package: bool

    def __init__(self, laytyp: int | list[int] = 0, layavg: int | list[int] = 0, chani: float | list[float] = 1.0,
                 layvka: int | list[int] = 0, laywet: int | list[int] = 0, ipakcb: int | None = None,
                 hdry: float = -1e30, iwdflg: int | list[int] = 0, wetfct: float = 0.1, iwetit: int = 1,
                 ihdwet: int = 0, hk: float | list[float | list[list[float]]] = 1.0,
                 hani: float | list[float | list[list[float]]] = 1.0,
                 vka: float | list[float | list[list[float]]] = 1.0, ss: float | list[float | list[list[float]]] = 1e-5,
                 sy: float | list[float | list[list[float]]] = 0.15,
                 vkcb: float | list[float | list[list[float]]] = 0.0,
                 wetdry: float | list[float | list[list[float]]] = -0.01, storagecoefficient: bool = False,
                 constantcv: bool = False, thickstrt: bool = False, nocvcorrection: bool = False,
                 novfc: bool = False, extension: str = "lpf", unitnumber: int | None = None,
                 filenames: str | list[str] | None = None, add_package: bool = True):
        self.laytyp = laytyp
        self.layavg = layavg
        self.chani = chani
        self.layvka = layvka
        self.laywet = laywet
        self.ipakcb = ipakcb
        self.hdry = hdry
        self.iwdflg = iwdflg
        self.wetfct = wetfct
        self.iwetit = iwetit
        self.ihdwet = ihdwet
        self.hk = hk
        self.hani = hani
        self.vka = vka
        self.ss = ss
        self.sy = sy
        self.vkcb = vkcb
        self.wetdry = wetdry
        self.storagecoefficient = storagecoefficient
        self.constantcv = constantcv
        self.thickstrt = thickstrt
        self.nocvcorrection = nocvcorrection
        self.novfc = novfc
        self.extension = extension
        self.unitnumber = unitnumber
        self.filenames = filenames
        self.add_package = add_package

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)


def calculate_lpf_package_data(model: Model, settings: LpfPackageSettings) -> LpfPackageData:
    laytyp = [0 for _ in model.layers.layers]
    for idx, layer in enumerate(model.layers.layers):
        if LayerConfinement.confined() == layer.confinement:
            laytyp[idx] = 0
        if LayerConfinement.convertible() == layer.confinement:
            laytyp[idx] = 1
        if LayerConfinement.unconfined() == layer.confinement:
            laytyp[idx] = -1

    package_data = LpfPackageData(
        laytyp=laytyp,
        layavg=[layer.properties.get_layer_average() for layer in model.layers.layers],
        chani=[0 for _ in model.layers.layers],
        layvka=[0 for _ in model.layers.layers],
        laywet=[int(layer.properties.is_wetting_active()) for layer in model.layers.layers],
        ipakcb=settings.ipakcb,
        hdry=settings.hdry,
        iwdflg=settings.iwdflg,
        wetfct=settings.wetfct,
        iwetit=settings.iwetit,
        ihdwet=settings.ihdwet,
        hk=[layer.properties.hk.get_data() for layer in model.layers.layers],
        hani=[layer.properties.get_horizontal_anisotropy() for layer in model.layers.layers],
        vka=[layer.properties.get_vka().get_data() for layer in model.layers.layers],
        ss=[layer.properties.specific_storage.get_data() for layer in model.layers.layers],
        sy=[layer.properties.specific_yield.get_data() for layer in model.layers.layers],
        vkcb=0.0,
        wetdry=settings.wetdry,
        storagecoefficient=settings.storagecoefficient,
        constantcv=settings.constantcv,
        thickstrt=settings.thickstrt,
        nocvcorrection=settings.nocvcorrection,
        novfc=settings.novfc,
        extension="lpf",
        unitnumber=None,
        filenames=None,
        add_package=True,
    )
    return package_data


def create_lpf_package(flopy_modflow: FlopyModflow, model: Model, settings: LpfPackageSettings) -> FlopyModflowLpf:
    lpf_package_data = calculate_lpf_package_data(model=model, settings=settings)
    return FlopyModflowLpf(model=flopy_modflow, **lpf_package_data.to_dict())
