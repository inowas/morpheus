import dataclasses

import numpy as np
from flopy.modflow.mfbas import ModflowBas as FlopyModflowBas

from morpheus.project.infrastructure.calculation.engines.modflow_2005 import FlopyModflow
from morpheus.project.types.Model import Model


@dataclasses.dataclass
class BasPackageData:
    ibound: int | list[list[list[int]]]
    strt: float | list[float | list[list[float]]]
    ifrefm: bool
    ixsec: bool
    ichflg: bool
    stoper: None | float
    hnoflo: float
    extension: str
    unitnumber: None | int
    filenames: None | str | list[str]

    def __init__(self, ibound: int | list[list[list[int]]] = 1, strt: float | list[float | list[list[float]]] = 1.0,
                 ifrefm: bool = True, ixsec: bool = False, ichflg: bool = False, stoper: None | float = None,
                 hnoflo: float = -999.99, extension: str = "bas", unitnumber: None | int = None,
                 filenames: None | str | list[str] = None):
        self.ibound = ibound
        self.strt = strt
        self.ifrefm = ifrefm
        self.ixsec = ixsec
        self.ichflg = ichflg
        self.stoper = stoper
        self.hnoflo = hnoflo
        self.extension = extension
        self.unitnumber = unitnumber
        self.filenames = filenames

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)


def calculate_bas_package_data(model: Model) -> BasPackageData:
    cells = model.spatial_discretization.affected_cells
    number_of_layers = model.layers.number_of_layers()
    if len(cells) == cells.shape[0] * cells.shape[1]:
        ibound = 1
    else:
        ibound = np.zeros((number_of_layers, cells.shape[1], cells.shape[0]), dtype=int)
        for layer_index in range(number_of_layers):
            for cell in cells:
                ibound[layer_index, cell.row, cell.col] = 1
        ibound = ibound.tolist()

    initial_heads = model.layers.initial_heads()

    return BasPackageData(ibound=ibound, strt=initial_heads)


def create_bas_package(flopy_modflow: FlopyModflow, model: Model) -> FlopyModflowBas:
    package_data = calculate_bas_package_data(model)
    return FlopyModflowBas(model=flopy_modflow, **package_data.to_dict())
