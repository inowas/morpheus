import dataclasses
from flopy.modflow import ModflowLpf as FlopyModflowLpf

from morpheus.modflow.infrastructure.calculation.modflow_2005 import FlopyModflow
from morpheus.modflow.types.ModflowModel import ModflowModel


@dataclasses.dataclass
class LpfPackageData:
    laytyp: int | list[int] = 0,
    layavg: int | list[int] = 0,
    chani: float | list[float] = 1.0,
    layvka: int | list[int] = 0,
    laywet: int | list[int] = 0,
    ipakcb: int | None = 0,
    hdry: float = -1e30,
    iwdflg: int | list[int] = 0,
    wetfct: float = 0.1,
    iwetit: int = 1,
    ihdwet: int = 0,
    hk: float | list[list[list[float]]] = 1.0,
    hani: float | list[list[list[float]]] = 1.0,
    vka: float | list[list[list[float]]] = 1.0,
    ss: float | list[list[list[float]]] = 1e-5,
    sy: float | list[list[list[float]]] = 0.15,
    vkcb: float | list[list[list[float]]] = 0.0,
    wetdry: float | list[list[list[float]]] = -0.01,
    storagecoefficient: bool = False,
    constantcv: bool = False,
    thickstrt: bool = False,
    nocvcorrection: bool = False,
    novfc: bool = False,
    extension: str = "lpf",
    unitnumber: int | None = None,
    filenames: str | list[str] | None = None,
    add_package: bool = True,

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> "LpfPackageData":
        return cls(**data)


def calculate_lpf_package_data(modflow_model: ModflowModel) -> LpfPackageData:
    lpf_package_data = LpfPackageData(
        laytyp=[0 if layer.is_confined() else 1 for layer in modflow_model.soil_model.layers],
        layavg=0,
    )
    return lpf_package_data


def create_lpf_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowLpf:
    lpf_package_data = calculate_lpf_package_data(modflow_model)
    return FlopyModflowLpf(
        model=flopy_modflow,
        laytyp=lpf_package_data.laytyp,
        layavg=lpf_package_data.layavg,
        chani=lpf_package_data.chani,
        layvka=lpf_package_data.layvka,
        laywet=lpf_package_data.laywet,
        ipakcb=lpf_package_data.ipakcb,
        hdry=lpf_package_data.hdry,
        iwdflg=lpf_package_data.iwdflg,
        wetfct=lpf_package_data.wetfct,
        iwetit=lpf_package_data.iwetit,
        ihdwet=lpf_package_data.ihdwet,
        hk=lpf_package_data.hk,
        hani=lpf_package_data.hani,
        vka=lpf_package_data.vka,
        ss=lpf_package_data.ss,
        sy=lpf_package_data.sy,
        vkcb=lpf_package_data.vkcb,
        wetdry=lpf_package_data.wetdry,
        storagecoefficient=lpf_package_data.storagecoefficient,
        constantcv=lpf_package_data.constantcv,
        thickstrt=lpf_package_data.thickstrt,
        nocvcorrection=lpf_package_data.nocvcorrection,
        novfc=lpf_package_data.novfc,
        extension=lpf_package_data.extension,
        unitnumber=lpf_package_data.unitnumber,
        filenames=lpf_package_data.filenames,
        add_package=lpf_package_data.add_package,
    )
