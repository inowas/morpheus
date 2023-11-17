import dataclasses
from ....types.ModflowModel import ModflowModel


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

    @staticmethod
    def custom_defaults() -> dict:
        return {}

    def with_custom_values(self, custom_values: dict):
        return DisPackageData(**{**dataclasses.asdict(self), **custom_values})

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


def calculate_dis_package_data(modflow_model: ModflowModel, custom_values: dict) -> DisPackageData:
    dis_package_data = DisPackageData(
        nlay=modflow_model.soil_model.number_of_layers(),
        nrow=modflow_model.spatial_discretization.grid.ny(),
        ncol=modflow_model.spatial_discretization.grid.nx(),
        nper=modflow_model.time_discretization.number_of_stress_periods(),
        delr=modflow_model.spatial_discretization.grid.y_coordinates,
        delc=modflow_model.spatial_discretization.grid.x_coordinates,
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
        xul=None,  # TODO: Implement
        yul=None,  # TODO: Implement
        rotation=modflow_model.spatial_discretization.grid.rotation.to_float(),
        crs=modflow_model.spatial_discretization.grid.crs.to_str(),
        start_datetime=modflow_model.time_discretization.start_datetime.to_str(),
    ).with_custom_values(custom_values)

    return dis_package_data
