import dataclasses
from . import FlopyModflow, FlopyModflowBas
from ....types.ModflowModel import ModflowModel
from ....types.calculation.Calculation import CalculationProfile


@dataclasses.dataclass
class BasPackageData:
    ibound: int | list[list[list[int]]] = 1,
    strt: float | list[list[list[float]]] = 1.0,
    ifrefm: bool = True,
    ixsec: bool = False,
    ichflg: bool = False,
    stoper: None | float = None,
    hnoflo: float = -999.99,
    extension: str = "bas",
    unitnumber: None | int = None,
    filenames: None | str | list[str] = None,

    @staticmethod
    def custom_defaults() -> dict:
        return {}

    def with_custom_values(self, custom_values: dict):
        return BasPackageData(**{**dataclasses.asdict(self), **custom_values})

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


def calculate_bas_package_data(modflow_model: ModflowModel, custom_values: dict) -> BasPackageData:
    model_affected_cells = modflow_model.spatial_discretization.affected_cells
    if not model_affected_cells:
        ibound = 1
    else:
        ibound = []
        number_of_layers = modflow_model.soil_model.number_of_layers()
        for layer in range(number_of_layers):
            ibound[layer] = model_affected_cells.get_layer(layer)

    initial_heads = modflow_model.soil_model.initial_heads()

    bas_package_data = BasPackageData(
        ibound=ibound,
        strt=initial_heads,
        ifrefm=True,
        ixsec=False,
        ichflg=False,
        stoper=None,
        hnoflo=-999.99,
        extension="bas",
    )
    return bas_package_data.with_custom_values(custom_values)


def create_bas_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel,
                       calculation_profile: CalculationProfile) -> FlopyModflowBas:
    custom_values = calculation_profile.get_package_data('bas')
    bas_package_data = calculate_bas_package_data(modflow_model, custom_values)

    return FlopyModflowBas(model=flopy_modflow, **bas_package_data.to_dict())
