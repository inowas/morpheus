import dataclasses
from flopy.modflow import ModflowDis as FlopyModflowDis

from morpheus.modflow.infrastructure.calculation.modflow_2005 import FlopyModflow
from morpheus.modflow.types.ModflowModel import ModflowModel


@dataclasses.dataclass
class DisPackageData:
    nlay: int = 1,
    nrow: int = 2,
    ncol: int = 2,
    nper: int = 1,
    delr: list[float] | float = 1.0,
    delc: list[float] | float = 1.0,
    laycbd: int | list[int] = 0,
    top: float | list[list[float]] = 1.0,
    botm: float | list[list[float]] = 0.0,
    perlen: float | list[float] = 1,
    nstp: int | list[int] = 1,
    tsmult: float | list[float] = 1,
    steady: bool | list[bool] = True,
    itmuni: int = 4,
    lenuni: int = 2,
    extension: str = "dis",
    unitnumber: None | int = None,
    filenames: None | str | list[str] = None,
    xul: None | float = None,
    yul: None | float = None,
    rotation: None | float = None,
    crs: str | None = None,
    start_datetime: None | str = None,

    def __init__(self, nlay: int = 1, nrow: int = 2, ncol: int = 2, nper: int = 1, delr: list[float] | float = 1.0,
                 delc: list[float] | float = 1.0, laycbd: int | list[int] = 0, top: float | list[list[float]] = 1.0,
                 botm: float | list[list[float]] = 0.0, perlen: float | list[float] = 1, nstp: int | list[int] = 1,
                 tsmult: float | list[float] = 1, steady: bool | list[bool] = True, itmuni: int = 4, lenuni: int = 2,
                 extension: str = "dis", unitnumber: None | int = None, filenames: None | str | list[str] = None,
                 xul: None | float = None, yul: None | float = None, rotation: None | float = None,
                 crs: str | None = None, start_datetime: None | str = None):
        self.nlay = nlay
        self.nrow = nrow
        self.ncol = ncol
        self.nper = nper
        self.delr = delr
        self.delc = delc
        self.laycbd = laycbd
        self.top = top
        self.botm = botm
        self.perlen = perlen
        self.nstp = nstp
        self.tsmult = tsmult
        self.steady = steady
        self.itmuni = itmuni
        self.lenuni = lenuni
        self.extension = extension
        self.unitnumber = unitnumber
        self.filenames = filenames
        self.xul = xul
        self.yul = yul
        self.rotation = rotation
        self.crs = crs
        self.start_datetime = start_datetime

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)


def calculate_dis_package_data(modflow_model: ModflowModel) -> DisPackageData:
    dis_package_data = DisPackageData(
        nlay=modflow_model.soil_model.number_of_layers(),
        nrow=modflow_model.spatial_discretization.grid.ny(),
        ncol=modflow_model.spatial_discretization.grid.nx(),
        nper=modflow_model.time_discretization.number_of_stress_periods(),
        delr=modflow_model.spatial_discretization.grid.y_distances,
        delc=modflow_model.spatial_discretization.grid.x_distances,
        laycbd=0,
        top=modflow_model.soil_model.top(),
        botm=modflow_model.soil_model.bottoms(),
        perlen=list(modflow_model.time_discretization.stress_period_lengths()),
        nstp=modflow_model.time_discretization.number_of_time_steps(),
        tsmult=modflow_model.time_discretization.time_step_multipliers(),
        steady=modflow_model.time_discretization.stress_period_types(),
        itmuni=modflow_model.time_discretization.time_unit.to_int(),
        lenuni=modflow_model.spatial_discretization.grid.length_unit.to_int(),
        xul=modflow_model.spatial_discretization.grid.origin.coordinates[0],
        yul=modflow_model.spatial_discretization.grid.origin.coordinates[1],
        rotation=modflow_model.spatial_discretization.grid.rotation.to_float(),
        crs=modflow_model.spatial_discretization.grid.crs.to_str(),
        start_datetime=modflow_model.time_discretization.start_date_time.to_str(),
    )

    return dis_package_data


def create_dis_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowDis:
    package_data = calculate_dis_package_data(modflow_model)
    return FlopyModflowDis(model=flopy_modflow, **package_data.to_dict())
