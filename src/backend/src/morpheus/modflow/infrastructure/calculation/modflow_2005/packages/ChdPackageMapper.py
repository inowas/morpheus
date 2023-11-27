import numpy as np
from shapely import LineString as ShapelyLineString, Point as ShapelyPoint

from morpheus.modflow.infrastructure.calculation.modflow_2005.types.StressPeriodData import StressPeriodData
from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.modflow.types.boundaries.Boundary import BoundaryType

from morpheus.modflow.types.boundaries.ConstantHead import ConstantHead
from morpheus.modflow.types.discretization.spatial import Grid
from morpheus.modflow.types.discretization.time.Stressperiods import StressPeriodCollection, StartDateTime, EndDateTime
from morpheus.modflow.types.soil_model import LayerId


class ChdStressPeriodData(StressPeriodData):
    pass


def calculate_chd_boundary_stress_period_data(
    stress_periods: StressPeriodCollection,
    start_date_times: list[StartDateTime],
    end_date_times: list[EndDateTime],
    layer_ids: list[LayerId],
    grid: Grid,
    chd_boundary: ConstantHead
):
    sp_data = ChdStressPeriodData()

    # first we need to calculate the mean values for each observation point and each stress period
    for stress_period_idx, stress_period in enumerate(stress_periods):
        start_date_time = start_date_times[stress_period_idx]
        end_date_time = end_date_times[stress_period_idx]
        mean_data = chd_boundary.get_mean_data(start_date_time, end_date_time)

        if chd_boundary.number_of_observations() == 0 or None in mean_data:
            # if we have no observation points
            # or if we have inconsistent or no observation data for this stress period
            # we do not apply any data for this stress period
            continue

        layer_indices = [layer_ids.index(layer_id) for layer_id in chd_boundary.affected_layers]
        if chd_boundary.number_of_observations() == 1:
            # if we only have one observation point
            # we can apply the one mean data item for each affected cell
            start_head = mean_data[0].start_head.to_float()
            end_head = mean_data[0].end_head.to_float()

            for layer_idx in layer_indices:
                for cell in chd_boundary.affected_cells:
                    sp_data.set_value(time_step=stress_period_idx, layer=layer_idx, row=cell.y, column=cell.x,
                                      values=[start_head, end_head], sum_to_existing=False)

        if chd_boundary.number_of_observations() > 1:
            # if we have multiple observation points
            # we need to interpolate the mean data for each affected cell ;(
            line_string = ShapelyLineString(chd_boundary.geometry.coordinates)

            xx: list[float] = []
            yy_start_heads: list[float] = []
            yy_end_heads = []
            for observation in chd_boundary.observations:
                shapely_point = ShapelyPoint(observation.geometry.coordinates)
                xx.append(line_string.project(shapely_point, normalized=True))
                yy_start_heads.append(
                    observation.get_mean_data(start_date_time, end_date_time).start_head.to_value())
                yy_end_heads.append(observation.get_mean_data(start_date_time, end_date_time).end_head.to_value())

            grid_cell_centers = grid.get_cell_centers()
            for cell in chd_boundary.affected_cells:
                center = ShapelyPoint(grid_cell_centers[cell.x][cell.y].coordinates)
                xx_new = [line_string.project(center, normalized=True)]
                yy_new_start_head = float(np.interp(xx_new, xx, yy_start_heads)[0])
                yy_new_end_head = float(np.interp(xx_new, xx, yy_end_heads)[0])

                for layer_idx in layer_indices:
                    sp_data.set_value(time_step=stress_period_idx, layer=layer_idx, row=cell.y, column=cell.x,
                                      values=[yy_new_start_head, yy_new_end_head], sum_to_existing=False)

    return sp_data


def calculate_stress_period_data(model: ModflowModel):
    sp_data = ChdStressPeriodData()
    chd_boundaries = model.boundaries.get_boundaries_of_type(BoundaryType.constant_head())
    for chd_boundary in chd_boundaries:
        layer_ids = model.soil_model.get_layer_ids()
        sp_data_boundary = calculate_chd_boundary_stress_period_data(
            stress_periods=model.time_discretization.stress_periods,
            start_date_times=model.time_discretization.get_start_date_times(),
            end_date_times=model.time_discretization.get_end_date_times(),
            layer_ids=layer_ids,
            grid=model.spatial_discretization.grid,
            chd_boundary=chd_boundary
        )
        sp_data = sp_data.merge(other=sp_data_boundary, sum_to_existing=False)

    return sp_data
