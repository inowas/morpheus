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
    crs: str = None,
    start_datetime: None | str = None,

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


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
        perlen=modflow_model.time_discretization.stress_period_lengths(),
        nstp=modflow_model.time_discretization.number_of_time_steps(),
        tsmult=modflow_model.time_discretization.time_step_multipliers(),
        steady=modflow_model.time_discretization.stress_period_types(),
        itmuni=modflow_model.time_discretization.time_unit.to_int(),
        lenuni=modflow_model.spatial_discretization.grid.length_unit.to_int(),
        extension="dis",
        unitnumber=None,
        filenames=None,
        xul=modflow_model.spatial_discretization.grid.origin.coordinates[0],
        yul=modflow_model.spatial_discretization.grid.origin.coordinates[1],
        rotation=modflow_model.spatial_discretization.grid.rotation.to_float(),
        crs=modflow_model.spatial_discretization.grid.crs.to_str(),
        start_datetime=modflow_model.time_discretization.start_datetime.to_str(),
    )

    return dis_package_data


def create_dis_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowDis:
    dis_package_data = calculate_dis_package_data(modflow_model)
    return FlopyModflowDis(
        model=flopy_modflow,
        nlay=dis_package_data.nlay,
        nrow=dis_package_data.nrow,
        ncol=dis_package_data.ncol,
        nper=dis_package_data.nper,
        delr=dis_package_data.delr,
        delc=dis_package_data.delc,
        laycbd=dis_package_data.laycbd,
        top=dis_package_data.top,
        botm=dis_package_data.botm,
        perlen=dis_package_data.perlen,
        nstp=dis_package_data.nstp,
        tsmult=dis_package_data.tsmult,
        steady=dis_package_data.steady,
        itmuni=dis_package_data.itmuni,
        lenuni=dis_package_data.lenuni,
        extension=dis_package_data.extension,
        unitnumber=dis_package_data.unitnumber,
        filenames=dis_package_data.filenames,
        xul=dis_package_data.xul,
        yul=dis_package_data.yul,
        rotation=dis_package_data.rotation,
        crs=dis_package_data.crs,
        start_datetime=dis_package_data.start_datetime,
    )
