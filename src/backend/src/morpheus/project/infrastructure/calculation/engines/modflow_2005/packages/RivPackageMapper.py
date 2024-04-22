import numpy as np
from shapely import LineString as ShapelyLineString, Point as ShapelyPoint

from morpheus.project.infrastructure.calculation.engines.modflow_2005.types.StressPeriodData import StressPeriodData
from morpheus.project.types.Model import Model
from morpheus.project.types.boundaries.Boundary import BoundaryType, RiverBoundary
from morpheus.project.types.boundaries.RiverObservation import RiverDataItem

from morpheus.project.types.discretization import TimeDiscretization, SpatialDiscretization
from morpheus.project.types.layers import LayersCollection


class RivStressPeriodData(StressPeriodData):
    pass


def calculate_riv_boundary_stress_period_data(
    spatial_discretization: SpatialDiscretization,
    time_discretization: TimeDiscretization,
    layers: LayersCollection,
    riv_boundary: RiverBoundary
) -> RivStressPeriodData:
    layer_ids = [layer.id for layer in layers]
    sp_data = RivStressPeriodData()

    # first we need to calculate the mean values for each observation point and each stress period
    for stress_period_idx, stress_period in enumerate(time_discretization.stress_periods):
        start_date_time = time_discretization.get_start_date_times()[stress_period_idx]
        end_date_time = time_discretization.get_end_date_times()[stress_period_idx]
        mean_data = riv_boundary.get_mean_data(start_date_time, end_date_time)

        if riv_boundary.number_of_observations() == 0 or None in mean_data:
            # if we have no observation points
            # or if we have inconsistent or no observation data for this stress period
            # we do not apply any data for this stress period
            continue

        layer_indices = [layer_ids.index(layer_id) for layer_id in riv_boundary.affected_layers]

        # we need to filter the affected cells to only include cells that are part of the model
        riv_boundary.affected_cells = riv_boundary.affected_cells.filter(
            lambda affected_cell: spatial_discretization.affected_cells.contains(affected_cell))

        if riv_boundary.number_of_observations() == 1:
            # if we only have one observation point
            # we can apply the one mean data item for each affected cell

            mean_data = mean_data[0]
            if not isinstance(mean_data, RiverDataItem):
                raise TypeError("Expected GeneralHeadDataItem but got {}".format(type(mean_data)))

            river_stage = mean_data.river_stage
            conductance = mean_data.conductance
            riverbed_bottom = mean_data.riverbed_bottom

            for cell in riv_boundary.affected_cells:
                if not spatial_discretization.affected_cells.contains(cell):
                    # if the cell is not part of the model
                    # we do not apply any data for this cell
                    continue

                for layer_idx in layer_indices:
                    sp_data.set_value(time_step=stress_period_idx, layer=layer_idx, row=cell.row, column=cell.col,
                                      values=[river_stage.to_float(), conductance.to_float(),
                                              riverbed_bottom.to_float()], sum_up_values=False)

        if riv_boundary.number_of_observations() > 1:
            # if we have multiple observation points
            # we need to interpolate the mean data for each affected cell ;(
            line_string = ShapelyLineString(riv_boundary.geometry.coordinates)

            observations = riv_boundary.get_observations()
            observations.sort(
                key=lambda obs: line_string.project(ShapelyPoint(obs.geometry.coordinates), normalized=True)
            )

            xx: list[float] = []
            yy_river_stages: list[float] = []
            yy_conductances = []
            yy_riverbed_bottoms: list[float] = []

            for observation in observations:
                shapely_point = ShapelyPoint(observation.geometry.coordinates)
                xx.append(line_string.project(shapely_point, normalized=True))

                mean_data = observation.get_data_item(start_date_time, end_date_time)
                if not isinstance(mean_data, RiverDataItem):
                    raise TypeError("Expected GeneralHeadDataItem but got {}".format(type(mean_data)))

                yy_river_stages.append(mean_data.river_stage.to_float())
                yy_conductances.append(mean_data.conductance.to_float())
                yy_riverbed_bottoms.append(mean_data.riverbed_bottom.to_float())

            grid_cell_centers = spatial_discretization.grid.get_cell_centers()
            for cell in riv_boundary.affected_cells:
                if spatial_discretization.affected_cells.is_active(col=cell.col, row=cell.row) is None:
                    # if the cell is not part of the model
                    # we do not apply any data for this cell
                    continue

                center = ShapelyPoint(grid_cell_centers[cell.row][cell.col].coordinates)
                xx_new = [line_string.project(center, normalized=True)]
                yy_new_river_stage = float(np.interp(xx_new, xx, yy_river_stages)[0])
                yy_new_conductance = float(np.interp(xx_new, xx, yy_conductances)[0])
                yy_new_riverbed_bottom = float(np.interp(xx_new, xx, yy_riverbed_bottoms)[0])

                for layer_idx in layer_indices:
                    sp_data.set_value(time_step=stress_period_idx, layer=layer_idx, row=cell.row, column=cell.col,
                                      values=[yy_new_river_stage, yy_new_conductance, yy_new_riverbed_bottom],
                                      sum_up_values=False)

    return sp_data


def calculate_stress_period_data(model: Model) -> RivStressPeriodData | None:
    sp_data = RivStressPeriodData()
    riv_boundaries = model.boundaries.get_boundaries_of_type(BoundaryType.river())
    for riv_boundary in riv_boundaries:
        if not isinstance(riv_boundary, RiverBoundary):
            raise TypeError(
                "Expected boundary of type {} but got {}".format(RiverBoundary.__name__, type(riv_boundary))
            )

        sp_data_boundary = calculate_riv_boundary_stress_period_data(
            spatial_discretization=model.spatial_discretization,
            time_discretization=model.time_discretization,
            layers=model.layers,
            riv_boundary=riv_boundary
        )
        sp_data = sp_data.merge(other=sp_data_boundary, sum_up_values=False)

    if sp_data.is_empty():
        return None

    return sp_data
