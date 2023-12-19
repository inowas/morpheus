import dataclasses
from flopy.modflow import ModflowLpf as FlopyModflowLpf

from morpheus.modflow.infrastructure.calculation.engines.modflow_2005 import FlopyModflow
from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.modflow.types.soil_model.Layer import LayerType


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
    hk: float | list[list[list[float]]]
    hani: float | list[list[list[float]]]
    vka: float | list[list[list[float]]]
    ss: float | list[list[list[float]]]
    sy: float | list[list[list[float]]]
    vkcb: float | list[list[list[float]]]
    wetdry: float | list[list[list[float]]]
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
                 ihdwet: int = 0, hk: float | list[list[list[float]]] = 1.0,
                 hani: float | list[list[list[float]]] = 1.0, vka: float | list[list[list[float]]] = 1.0,
                 ss: float | list[list[list[float]]] = 1e-5, sy: float | list[list[list[float]]] = 0.15,
                 vkcb: float | list[list[list[float]]] = 0.0,
                 wetdry: float | list[list[list[float]]] = -0.01, storagecoefficient: bool = False,
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


def calculate_lpf_package_data(modflow_model: ModflowModel) -> LpfPackageData:
    laytyp = [0 for _ in modflow_model.soil_model.layers]
    for idx, layer in enumerate(modflow_model.soil_model.layers):
        if LayerType.confined() == layer.type:
            laytyp[idx] = 0
        if LayerType.convertible() == layer.type:
            laytyp[idx] = 1
        if LayerType.unconfined() == layer.type:
            laytyp[idx] = -1

    package_data = LpfPackageData(
        laytyp=laytyp,
        layavg=[layer.data.get_layer_average() for layer in modflow_model.soil_model.layers],
        chani=[0 for _ in modflow_model.soil_model.layers],
        layvka=[0 for _ in modflow_model.soil_model.layers],
        laywet=[int(layer.data.is_wetting_active()) for layer in modflow_model.soil_model.layers],
        ipakcb=0,  # 53 in the current frontend
        hdry=-1e30,
        iwdflg=0,
        wetfct=0.1,
        iwetit=1,
        ihdwet=0,
        hk=[layer.data.kx for layer in modflow_model.soil_model.layers],
        hani=[layer.data.get_horizontal_anisotropy() for layer in modflow_model.soil_model.layers],
        vka=[layer.data.get_vka() for layer in modflow_model.soil_model.layers],
        ss=[layer.data.specific_storage for layer in modflow_model.soil_model.layers],
        sy=[layer.data.specific_yield for layer in modflow_model.soil_model.layers],
        vkcb=0.0,
        wetdry=-0.01,
        storagecoefficient=False,
        constantcv=False,
        thickstrt=False,
        nocvcorrection=False,
        novfc=False,
        extension="lpf",
        unitnumber=None,
        filenames=None,
        add_package=True,
    )
    return package_data


def create_lpf_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowLpf:
    lpf_package_data = calculate_lpf_package_data(modflow_model)
    return FlopyModflowLpf(model=flopy_modflow, **lpf_package_data.to_dict())
