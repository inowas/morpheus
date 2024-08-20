from morpheus.project.infrastructure.calculation.engines.modflow_2005.types.StressPeriodData import (
    LayerBasedStressPeriodData
)
from morpheus.project.types.Model import Model
from morpheus.project.types.boundaries.Boundary import BoundaryType, RechargeBoundary
from morpheus.project.types.boundaries.RechargeObservation import RechargeDataItem

from morpheus.project.types.discretization import TimeDiscretization, SpatialDiscretization
from morpheus.project.types.layers import LayersCollection


class RchStressPeriodData(LayerBasedStressPeriodData):
    pass


def calculate_rch_boundary_stress_period_data(
    spatial_discretization: SpatialDiscretization,
    time_discretization: TimeDiscretization,
    layers: LayersCollection,
    rch_boundary: RechargeBoundary
) -> RchStressPeriodData:
    grid = spatial_discretization.grid
    sp_data = RchStressPeriodData(nx=grid.n_cols(), ny=grid.n_rows())

    # first we need to calculate the mean values for each observation point and each stress period
    for stress_period_idx, stress_period in enumerate(time_discretization.stress_periods):
        start_date_time = time_discretization.get_start_date_times()[stress_period_idx]
        end_date_time = time_discretization.get_end_date_times()[stress_period_idx]
        mean_data = rch_boundary.get_mean_data(start_date_time=start_date_time, end_date_time=end_date_time, interpolation=rch_boundary.interpolation)

        if rch_boundary.number_of_observations() == 0 or None in mean_data:
            # if we have no observation points
            # or if we have inconsistent or no observation data for this stress period
            # we do not apply any data for this stress period
            continue

        if rch_boundary.number_of_observations() > 1:
            raise NotImplementedError("Multiple observations for well boundaries are not supported")

        # we need to filter the affected cells to only include cells that are part of the model
        rch_boundary.affected_cells = rch_boundary.affected_cells.mask(other=spatial_discretization.affected_cells)

        if rch_boundary.number_of_observations() == 1:
            mean_data = mean_data[0]
            if not isinstance(mean_data, RechargeDataItem):
                raise TypeError("Expected RechargeDataItem but got {}".format(type(mean_data)))

            recharge_rate = mean_data.recharge_rate

            for cell in rch_boundary.affected_cells:
                # recharge rates will be replaced if already set
                sp_data.set_value(time_step=stress_period_idx, row=cell.row, column=cell.col,
                                  values=[recharge_rate.to_float()], sum_up_values=False)

    return sp_data


def calculate_stress_period_data(model: Model) -> RchStressPeriodData | None:
    grid = model.spatial_discretization.grid
    sp_data = RchStressPeriodData(nx=grid.n_cols(), ny=grid.n_rows())
    boundaries = model.boundaries.get_boundaries_of_type(BoundaryType.recharge)
    for boundary in boundaries:
        if not isinstance(boundary, RechargeBoundary):
            raise TypeError(
                "Expected boundary of type {} but got {}".format(RechargeBoundary.__name__, type(boundary))
            )

        sp_data_boundary = calculate_rch_boundary_stress_period_data(
            layers=model.layers,
            spatial_discretization=model.spatial_discretization,
            time_discretization=model.time_discretization,
            rch_boundary=boundary
        )
        sp_data = sp_data.merge(other=sp_data_boundary, sum_up_values=False)

    if sp_data.is_empty():
        return None

    return sp_data
