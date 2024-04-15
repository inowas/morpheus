import dataclasses
from flopy.modflow import ModflowDis as FlopyModflowDis

from morpheus.project.infrastructure.calculation.engines.modflow_2005 import FlopyModflow
from morpheus.project.types.Model import Model


@dataclasses.dataclass
class DisPackageData:
    nlay: int
    nrow: int
    ncol: int
    nper: int
    delr: list[float] | float
    delc: list[float] | float
    laycbd: int | list[int]
    top: float | list[list[float]]
    botm: float | list[float | list[list[float]]]
    perlen: float | list[float]
    nstp: int | list[int]
    tsmult: float | list[float]
    steady: bool | list[bool]
    itmuni: int
    lenuni: int
    extension: str
    unitnumber: None | int
    filenames: None | str | list[str]
    xul: None | float
    yul: None | float
    rotation: None | float
    crs: str | None
    start_datetime: str | None

    def __init__(self, nlay: int = 1, nrow: int = 2, ncol: int = 2, nper: int = 1, delr: list[float] | float = 1.0,
                 delc: list[float] | float = 1.0, laycbd: int | list[int] = 0, top: float | list[list[float]] = 1.0,
                 botm: float | list[float | list[list[float]]] = 0.0, perlen: float | list[float] = 1,
                 nstp: int | list[int] = 1, tsmult: float | list[float] = 1, steady: bool | list[bool] = True,
                 itmuni: int = 4, lenuni: int = 2, extension: str = "dis", unitnumber: None | int = None,
                 filenames: None | str | list[str] = None, xul: None | float = None, yul: None | float = None,
                 rotation: None | float = None, crs: str | None = None, start_datetime: str | None = None):
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


def calculate_dis_package_data(model: Model) -> DisPackageData:
    dis_package_data = DisPackageData(
        nlay=model.soil_model.number_of_layers(),
        nrow=model.spatial_discretization.grid.n_rows(),
        ncol=model.spatial_discretization.grid.n_cols(),
        nper=model.time_discretization.number_of_stress_periods(),
        delr=model.spatial_discretization.grid.col_widths,
        delc=model.spatial_discretization.grid.row_heights,
        laycbd=0,
        top=model.soil_model.top(),
        botm=model.soil_model.bottoms(),
        perlen=list(model.time_discretization.stress_period_lengths()),
        nstp=model.time_discretization.number_of_time_steps(),
        tsmult=model.time_discretization.time_step_multipliers(),
        steady=model.time_discretization.stress_period_types(),
        itmuni=model.time_discretization.time_unit.to_int(),
        lenuni=model.spatial_discretization.grid.length_unit.to_int(),
        xul=model.spatial_discretization.grid.origin.coordinates[0],
        yul=model.spatial_discretization.grid.origin.coordinates[1],
        rotation=model.spatial_discretization.grid.rotation.to_float(),
        crs=model.spatial_discretization.grid.crs.to_str(),
        start_datetime=model.time_discretization.start_date_time.to_str(),
    )

    return dis_package_data


def create_dis_package(flopy_modflow: FlopyModflow, model: Model) -> FlopyModflowDis:
    package_data = calculate_dis_package_data(model)
    return FlopyModflowDis(model=flopy_modflow, **package_data.to_dict())
