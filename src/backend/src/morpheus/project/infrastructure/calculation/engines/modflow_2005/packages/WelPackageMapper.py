from morpheus.project.infrastructure.calculation.engines.modflow_2005.types.StressPeriodData import StressPeriodData
from morpheus.project.types.Model import Model
from morpheus.project.types.boundaries.Boundary import BoundaryType, WellBoundary
from morpheus.project.types.boundaries.WellObservation import WellDataItem

from morpheus.project.types.discretization import TimeDiscretization, SpatialDiscretization
from morpheus.project.types.layers import LayersCollection


class WelStressPeriodData(StressPeriodData):
    pass


def calculate_wel_boundary_stress_period_data(
    spatial_discretization: SpatialDiscretization,
    time_discretization: TimeDiscretization,
    layers: LayersCollection,
    wel_boundary: WellBoundary
) -> WelStressPeriodData:
    layer_ids = [layer.layer_id for layer in layers]
    sp_data = WelStressPeriodData()

    # first we need to calculate the mean values for each observation point and each stress period
    for stress_period_idx, stress_period in enumerate(time_discretization.stress_periods):
        start_date_time = time_discretization.get_start_date_times()[stress_period_idx]
        end_date_time = time_discretization.get_end_date_times()[stress_period_idx]
        mean_data = wel_boundary.get_mean_data(start_date_time=start_date_time, end_date_time=end_date_time, interpolation=wel_boundary.interpolation)

        if wel_boundary.number_of_observations() == 0 or None in mean_data:
            # if we have no observation points
            # or if we have inconsistent or no observation data for this stress period
            # we do not apply any data for this stress period
            continue

        if wel_boundary.number_of_observations() > 1:
            raise NotImplementedError("Multiple observations for well boundaries are not supported")

        layer_indices = [layer_ids.index(layer_id) for layer_id in wel_boundary.affected_layers]

        # we need to filter the affected cells to only include cells that are part of the model
        wel_boundary.affected_cells = wel_boundary.affected_cells.filter(lambda cell: spatial_discretization.affected_cells.contains(cell))

        if wel_boundary.number_of_observations() == 1:
            mean_data = mean_data[0]
            if not isinstance(mean_data, WellDataItem):
                raise TypeError("Expected GeneralHeadDataItem but got {}".format(type(mean_data)))

            pumping_rate = mean_data.pumping_rate

            for cell in wel_boundary.affected_cells:
                if not spatial_discretization.affected_cells.contains(cell):
                    # if the cell is not part of the model
                    # we do not apply any data for this cell
                    continue

                # for pumping rates we distribute the pumping rate equally over all layers
                # pumping rates will be summed up
                for layer_idx in layer_indices:
                    sp_data.set_value(time_step=stress_period_idx, layer=layer_idx, row=cell.row, column=cell.col, values=[pumping_rate.to_float() / len(layer_indices)], sum_up_values=True)

    return sp_data


def calculate_stress_period_data(model: Model) -> WelStressPeriodData | None:
    sp_data = WelStressPeriodData()

    wel_boundaries = model.boundaries.get_boundaries_of_type(BoundaryType.well)
    for wel_boundary in wel_boundaries:
        if not isinstance(wel_boundary, WellBoundary):
            raise TypeError(
                "Expected boundary of type {} but got {}".format(WellBoundary.__name__, type(wel_boundary))
            )

        sp_data_boundary = calculate_wel_boundary_stress_period_data(
            spatial_discretization=model.spatial_discretization,
            time_discretization=model.time_discretization,
            layers=model.layers,
            wel_boundary=wel_boundary
        )
        sp_data = sp_data.merge(other=sp_data_boundary, sum_up_values=True)

    if sp_data.is_empty():
        return None

    return sp_data
