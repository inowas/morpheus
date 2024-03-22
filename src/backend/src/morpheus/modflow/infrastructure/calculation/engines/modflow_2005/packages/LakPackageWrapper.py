import dataclasses
from typing import Literal, Tuple

import numpy as np
from flopy.modflow import ModflowLak as FlopyModflowLak

from morpheus.modflow.types.boundaries.Boundary import BoundaryType, LakeBoundary
from morpheus.modflow.types.boundaries.LakeObservation import LakeObservation
from morpheus.modflow.types.discretization.spatial.ActiveCells import ActiveCell
from .LakPackageMapper import calculate_stress_period_data
from ...modflow_2005 import FlopyModflow
from morpheus.modflow.types.ModflowModel import ModflowModel


@dataclasses.dataclass
class LakPackageData:
    nlakes: int
    ipakcb: None | int
    theta: float
    nssitr: int
    surfdep: float
    stages: float | list[float]
    stage_range: list[Tuple[float, float]]
    lakarr: np.ndarray
    bdlknc: np.ndarray
    sill_data: dict[int, list] | None
    flux_data: dict[int, list]
    extension: Literal["lak"]
    unitnumber: None | int
    filenames: None | str | list[str]
    options: None | list[str]
    lwrt: int

    def __init__(self, flux_data: dict[int, list], lakarr: np.ndarray, bdlknc: np.ndarray, stages: list[float],
                 stage_range: list[Tuple[float, float]], sill_data: dict[int, list] | None = None, nlakes: int = 1,
                 theta: float = 1.0, nssitr: int = 0, sscncr: float = 0.001, surfdep: float = 0.0
                 ):
        self.nlakes = nlakes
        self.ipakcb = None
        self.theta = theta
        self.nssitr = nssitr
        self.sscncr = sscncr
        self.surfdep = surfdep
        self.stages = stages
        self.stage_range = stage_range
        self.lakarr = lakarr
        self.bdlknc = bdlknc
        self.sill_data = sill_data
        self.flux_data = flux_data
        self.extension = 'lak'
        self.unitnumber = None
        self.filenames = None
        self.options = None
        self.lwrt = 0

    def to_dict(self) -> dict:
        return {
            'nlakes': self.nlakes,
            'ipakcb': self.ipakcb,
            'theta': self.theta,
            'nssitr': self.nssitr,
            'sscncr': self.sscncr,
            'surfdep': self.surfdep,
            'stages': self.stages,
            'stage_range': self.stage_range,
            'lakarr': self.lakarr,
            'bdlknc': self.bdlknc,
            'sill_data': self.sill_data,
            'flux_data': self.flux_data,
            'extension': self.extension,
            'unitnumber': self.unitnumber,
            'filenames': self.filenames,
            'options': self.options,
            'lwrt': self.lwrt,
        }


def calculate_lak_package_data(modflow_model: ModflowModel) -> LakPackageData | None:
    lake_boundaries = modflow_model.boundaries.get_boundaries_of_type(BoundaryType.lake())

    nx = modflow_model.spatial_discretization.grid.n_col()
    ny = modflow_model.spatial_discretization.grid.n_row()
    nz = modflow_model.soil_model.number_of_layers()

    if len(lake_boundaries) == 0:
        return None

    nlakes = len(lake_boundaries)
    stages = []
    stage_range = []
    lakarr = np.zeros((nz, ny, nx), dtype=int)
    bdlknc = np.zeros((nz, ny, nx), dtype=float)

    for lake_id, lake_boundary in enumerate(lake_boundaries):
        if not isinstance(lake_boundary, LakeBoundary):
            raise TypeError("Expected LakeBoundary but got {}".format(type(lake_boundary)))
        observation = lake_boundary.get_observation()
        if not isinstance(observation, LakeObservation):
            raise ValueError("Expected LakeObservation but got {}".format(type(observation)))

        stages.append(observation.initial_stage.to_float())
        stage_range.append((observation.stage_range.min, observation.stage_range.max))

        layer_ids = [layer.id for layer in modflow_model.soil_model.layers]
        layer_indices = [layer_ids.index(layer_id) for layer_id in lake_boundary.affected_layers]

        for affected_cell in lake_boundary.affected_cells:
            if not isinstance(affected_cell, ActiveCell):
                raise TypeError("Expected GridCell but got {}".format(type(affected_cell)))

            for layer_idx in layer_indices:
                lakarr[layer_idx, affected_cell.row, affected_cell.col] = lake_id + 1

                bed_leakance = observation.bed_leakance.to_float()
                bdlknc[layer_idx][affected_cell.row][affected_cell.col] = bed_leakance
                if affected_cell.col > 0:
                    bdlknc[layer_idx, affected_cell.row, affected_cell.col - 1] = bed_leakance
                if affected_cell.col < nx - 1:
                    bdlknc[layer_idx, affected_cell.row, affected_cell.col + 1] = bed_leakance
                if affected_cell.row > 0:
                    bdlknc[layer_idx, affected_cell.row - 1, affected_cell.col] = bed_leakance
                if affected_cell.row < ny - 1:
                    bdlknc[layer_idx, affected_cell.row + 1, affected_cell.col] = bed_leakance
                if layer_idx > 0:
                    bdlknc[layer_idx - 1, affected_cell.row, affected_cell.col] = bed_leakance
                if layer_idx < nz - 1:
                    bdlknc[layer_idx + 1, affected_cell.row, affected_cell.col] = bed_leakance

    lak_flux_data = calculate_stress_period_data(modflow_model)

    if lak_flux_data is None:
        return None

    return LakPackageData(nlakes=nlakes, stages=stages, stage_range=stage_range, lakarr=lakarr,
                          bdlknc=bdlknc, sill_data=None, flux_data=lak_flux_data.to_dict())


def create_lak_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowLak | None:
    package_data = calculate_lak_package_data(modflow_model)
    if package_data is None:
        return None

    return FlopyModflowLak(model=flopy_modflow, **package_data.to_dict())
