import dataclasses
from flopy.modflow.mfbas import ModflowBas as FlopyModflowBas

from morpheus.modflow.infrastructure.calculation.modflow_2005 import FlopyModflow
from morpheus.modflow.types.ModflowModel import ModflowModel


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

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


def calculate_bas_package_data(modflow_model: ModflowModel) -> BasPackageData:
    cells = modflow_model.spatial_discretization.affected_cells
    number_of_layers = modflow_model.soil_model.number_of_layers()
    ibound = []
    if len(cells) == cells.shape[0] * cells.shape[1]:
        ibound = 1
    else:
        for layer in range(number_of_layers):
            ibound[layer] = [[cells.get_cell(x=x, y=y).value for y in range(cells.shape[1])] for x in
                             range(cells.shape[0])]

    initial_heads = modflow_model.soil_model.initial_heads()

    return BasPackageData(
        ibound=ibound,
        strt=initial_heads,
        ifrefm=True,
        ixsec=False,
        ichflg=False,
        stoper=None,
        hnoflo=-999.99,
        extension="bas",
    )


def create_bas_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowBas:
    bas_package_data = calculate_bas_package_data(modflow_model)
    return FlopyModflowBas(
        model=flopy_modflow,
        ibound=bas_package_data.ibound,
        strt=bas_package_data.strt,
        ifrefm=bas_package_data.ifrefm,
        ixsec=bas_package_data.ixsec,
        ichflg=bas_package_data.ichflg,
        stoper=bas_package_data.stoper,
        hnoflo=bas_package_data.hnoflo,
        extension=bas_package_data.extension,
        unitnumber=bas_package_data.unitnumber,
        filenames=bas_package_data.filenames
    )
