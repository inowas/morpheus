from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.types.StressPeriodData import (
    LayerBasedStressPeriodData
)
from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.modflow.types.boundaries.Boundary import BoundaryType, EvapotranspirationBoundary
from morpheus.modflow.types.boundaries.EvapotranspirationObservation import EvapotranspirationDataItem

from morpheus.modflow.types.discretization import TimeDiscretization, SpatialDiscretization
from morpheus.modflow.types.soil_model import SoilModel


class EvtStressPeriodData(LayerBasedStressPeriodData):
    def get_surface_elevation_sp_data(self) -> dict[list[list[float]]]:
        return self.to_dict(0)

    def get_evapotranspiration_sp_data(self) -> dict[list[list[float]]]:
        return self.to_dict(1)

    def get_extinction_depth_sp_data(self) -> dict[list[list[float]]]:
        return self.to_dict(2)

    def get_layer_index_sp_data(self) -> dict[list[list[int]]]:
        return self.to_dict(3)


def calculate_evt_boundary_stress_period_data(
    soil_model: SoilModel,
    spatial_discretization: SpatialDiscretization,
    time_discretization: TimeDiscretization,
    evt_boundary: EvapotranspirationBoundary
) -> EvtStressPeriodData:
    grid = spatial_discretization.grid
    sp_data = EvtStressPeriodData(nx=grid.nx(), ny=grid.ny())

    layer_ids = [layer.id for layer in soil_model.layers]
    layer_indices = [layer_ids.index(layer_id) for layer_id in evt_boundary.affected_layers]
    layer_index = layer_indices[0] if len(layer_indices) > 0 else 0

    # first we need to calculate the mean values for each observation point and each stress period
    for stress_period_idx, stress_period in enumerate(time_discretization.stress_periods):
        start_date_time = time_discretization.get_start_date_times()[stress_period_idx]
        end_date_time = time_discretization.get_end_date_times()[stress_period_idx]
        mean_data = evt_boundary.get_mean_data(start_date_time, end_date_time)

        if evt_boundary.number_of_observations() == 0 or None in mean_data:
            # if we have no observation points
            # or if we have inconsistent or no observation data for this stress period
            # we do not apply any data for this stress period
            continue

        if evt_boundary.number_of_observations() > 1:
            raise NotImplementedError("Multiple observations for well boundaries are not supported")

        # we need to filter the affected cells to only include cells that are part of the model
        evt_boundary.affected_cells = evt_boundary.affected_cells.filter(
            lambda affected_cell: spatial_discretization.affected_cells.contains(affected_cell))

        mean_data = mean_data[0]
        if not isinstance(mean_data, EvapotranspirationDataItem):
            raise TypeError("Expected EvapotranspirationDataItem but got {}".format(type(mean_data)))

        surface_elevation = mean_data.surface_elevation
        evapotranspiration = mean_data.evapotranspiration
        extinction_depth = mean_data.extinction_depth

        for cell in evt_boundary.affected_cells:
            # evapotranspiration rates will be replaced
            sp_data.set_value(
                time_step=stress_period_idx, row=cell.y, column=cell.x,
                values=[surface_elevation.to_float(), evapotranspiration.to_float(),
                        extinction_depth.to_float(), layer_index],
                sum_up_values=False
            )

    return sp_data


def calculate_stress_period_data(model: ModflowModel) -> EvtStressPeriodData | None:
    grid = model.spatial_discretization.grid
    sp_data = EvtStressPeriodData(nx=grid.nx(), ny=grid.ny())
    boundaries = model.boundaries.get_boundaries_of_type(BoundaryType.evapotranspiration())
    for boundary in boundaries:
        if not isinstance(boundary, EvapotranspirationBoundary):
            raise TypeError(
                "Expected boundary of type {} but got {}".format(
                    EvapotranspirationBoundary.__name__, type(boundary)
                )
            )

        sp_data_boundary = calculate_evt_boundary_stress_period_data(
            soil_model=model.soil_model,
            spatial_discretization=model.spatial_discretization,
            time_discretization=model.time_discretization,
            evt_boundary=boundary
        )
        sp_data = sp_data.merge(other=sp_data_boundary, sum_up_values=False)

    if sp_data.is_empty():
        return None

    return sp_data
