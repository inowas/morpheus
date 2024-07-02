import dataclasses
from typing import Sequence

from morpheus.project.types.Model import Model
from morpheus.project.types.boundaries.Boundary import BoundaryType, Boundary
from morpheus.project.types.boundaries.LakeObservation import LakeDataItem

from morpheus.project.types.discretization import TimeDiscretization, SpatialDiscretization


@dataclasses.dataclass
class LakStressPeriodDataItem:
    time_step: int
    lake_idx: int
    evaporation: float
    precipitation: float
    runoff: float
    withdrawal: float


class LakStressPeriodData:
    data: list[LakStressPeriodDataItem]

    def __init__(self, data: list[LakStressPeriodDataItem] | None = None):
        self.data = data or []

    def set_value(self, time_step: int, lake_idx: int, evaporation: float, precipitation: float, runoff: float,
                  withdrawal: float):
        if time_step < 0:
            raise ValueError(f"Time step must be greater than or equal to 0. Got {time_step}")

        for item in self.data:
            if item.time_step == time_step and item.lake_idx == lake_idx:
                item.evaporation = evaporation
                item.precipitation = precipitation
                item.runoff = runoff
                item.withdrawal = withdrawal
                return

        self.data.append(LakStressPeriodDataItem(
            time_step=time_step,
            lake_idx=lake_idx,
            evaporation=evaporation,
            precipitation=precipitation,
            runoff=runoff,
            withdrawal=withdrawal
        ))

    def is_empty(self):
        return len(self.data) == 0

    def to_dict(self) -> dict:
        number_of_lakes = max([item.lake_idx for item in self.data]) + 1
        self.data.sort(key=lambda item: item.time_step)
        self.data.sort(key=lambda item: item.lake_idx)

        sp_data = {}
        for item in self.data:
            sp_data.setdefault(item.time_step, [[] * number_of_lakes])
            sp_data[item.time_step][item.lake_idx] = [item.evaporation, item.precipitation, item.runoff,
                                                      item.withdrawal]

        return sp_data


def calculate_lak_boundary_stress_period_data(
    spatial_discretization: SpatialDiscretization,
    time_discretization: TimeDiscretization,
    lak_boundaries: Sequence[Boundary]
) -> LakStressPeriodData:
    sp_data = LakStressPeriodData()

    # first we need to calculate the mean values for each observation point and each stress period
    for stress_period_idx, stress_period in enumerate(time_discretization.stress_periods):
        start_date_time = time_discretization.get_start_date_times()[stress_period_idx]
        end_date_time = time_discretization.get_end_date_times()[stress_period_idx]

        for lake_idx, lak_boundary in enumerate(lak_boundaries):
            mean_data = lak_boundary.get_mean_data(start_date_time=start_date_time, end_date_time=end_date_time, interpolation=lak_boundary.interpolation)

            if lak_boundary.number_of_observations() == 0 or None in mean_data:
                # if we have no observation points
                # or if we have inconsistent or no observation data for this stress period
                # we do not apply any data for this stress period
                continue

            if lak_boundary.number_of_observations() > 1:
                raise NotImplementedError("Multiple observations for well boundaries are not supported")

            # we need to filter the affected cells to only include cells that are part of the model
            lak_boundary.affected_cells = lak_boundary.affected_cells.filter(
                lambda affected_cell: spatial_discretization.affected_cells.contains(affected_cell))

            mean_data = mean_data[0]
            if not isinstance(mean_data, LakeDataItem):
                raise TypeError("Expected LakeDataItem but got {}".format(type(mean_data)))

            evaporation = mean_data.evaporation
            precipitation = mean_data.precipitation
            runoff = mean_data.runoff
            withdrawal = mean_data.withdrawal

            sp_data.set_value(
                time_step=stress_period_idx, lake_idx=lake_idx,
                evaporation=evaporation.to_float(), precipitation=precipitation.to_float(),
                runoff=runoff.to_float(), withdrawal=withdrawal.to_float()
            )

    return sp_data


def calculate_stress_period_data(model: Model) -> LakStressPeriodData | None:
    sp_data = calculate_lak_boundary_stress_period_data(
        spatial_discretization=model.spatial_discretization,
        time_discretization=model.time_discretization,
        lak_boundaries=model.boundaries.get_boundaries_of_type(BoundaryType.lake())  # Sequence[Boundary]
    )

    if sp_data.is_empty():
        return None

    return sp_data
