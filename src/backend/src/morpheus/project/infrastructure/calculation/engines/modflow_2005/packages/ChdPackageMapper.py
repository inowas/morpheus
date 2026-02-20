import numpy as np
from shapely import LineString as ShapelyLineString
from shapely import Point as ShapelyPoint

from morpheus.project.infrastructure.calculation.engines.modflow_2005.types.StressPeriodData import StressPeriodData
from morpheus.project.types.boundaries.Boundary import BoundaryType, ConstantHeadBoundary
from morpheus.project.types.boundaries.ConstantHeadObservation import ConstantHeadDataItem
from morpheus.project.types.discretization import SpatialDiscretization, TimeDiscretization
from morpheus.project.types.layers import LayersCollection
from morpheus.project.types.Model import Model


class ChdStressPeriodData(StressPeriodData):
    pass


def calculate_chd_boundary_stress_period_data(
    spatial_discretization: SpatialDiscretization, time_discretization: TimeDiscretization, layers: LayersCollection, chd_boundary: ConstantHeadBoundary
) -> ChdStressPeriodData:
    layer_ids = [layer.layer_id for layer in layers.layers]
    sp_data = ChdStressPeriodData()

    # first we need to calculate the mean values for each observation point and each stress period
    for stress_period_idx, _stress_period in enumerate(time_discretization.stress_periods):
        start_date_time = time_discretization.get_start_date_times()[stress_period_idx]
        end_date_time = time_discretization.get_end_date_times()[stress_period_idx]
        mean_data = chd_boundary.get_mean_data(start_date_time=start_date_time, end_date_time=end_date_time, interpolation=chd_boundary.interpolation)

        if chd_boundary.number_of_observations() == 0 or None in mean_data:
            # if we have no observation points
            # or if we have inconsistent or no observation data for this stress period
            # we do not apply any data for this stress period
            continue

        layer_indices = [layer_ids.index(layer_id) for layer_id in chd_boundary.affected_layers]

        # we need to filter the affected cells to only include cells that are part of the model
        chd_boundary.affected_cells = chd_boundary.affected_cells.filter(lambda affected_cell: spatial_discretization.affected_cells.contains(affected_cell))

        if chd_boundary.number_of_observations() == 1:
            # if we only have one observation point
            # we can apply the one mean data item for each affected cell

            mean_data = mean_data[0]
            if not isinstance(mean_data, ConstantHeadDataItem):
                raise TypeError(f'Expected ConstantHeadDataItem but got {type(mean_data)}')

            start_head = mean_data.start_head
            end_head = mean_data.end_head

            for cell in chd_boundary.affected_cells:
                if not spatial_discretization.affected_cells.contains(cell):
                    # if the cell is not part of the model
                    # we do not apply any data for this cell
                    continue

                for layer_idx in layer_indices:
                    sp_data.set_value(
                        time_step=stress_period_idx, layer=layer_idx, row=cell.row, column=cell.col, values=[start_head.to_float(), end_head.to_float()], sum_up_values=False
                    )

        if chd_boundary.number_of_observations() > 1:
            # if we have multiple observation points
            # we need to interpolate the mean data for each affected cell ;(
            line_string = ShapelyLineString(chd_boundary.geometry.coordinates)
            observations = chd_boundary.get_observations()
            observations.sort(key=lambda obs: line_string.project(ShapelyPoint(obs.geometry.coordinates), normalized=True))

            xx: list[float] = []
            yy_start_heads: list[float] = []
            yy_end_heads = []
            for observation in observations:
                shapely_point = ShapelyPoint(observation.geometry.coordinates)
                xx.append(line_string.project(shapely_point, normalized=True))
                mean_data = observation.get_data_item(start_date_time=start_date_time, end_date_time=end_date_time, interpolation=chd_boundary.interpolation)
                if not isinstance(mean_data, ConstantHeadDataItem):
                    raise TypeError(f'Expected ConstantHeadDataItem but got {type(mean_data)}')
                yy_start_heads.append(mean_data.start_head.to_float())
                yy_end_heads.append(mean_data.end_head.to_float())

            grid_cell_centers = spatial_discretization.grid.get_wgs_cell_centers()
            for cell in chd_boundary.affected_cells:
                if spatial_discretization.affected_cells.is_active(col=cell.col, row=cell.row) is None:
                    # if the cell is not part of the model
                    # we do not apply any data for this cell
                    continue

                center = ShapelyPoint(grid_cell_centers[cell.row][cell.col].coordinates)
                xx_new = [line_string.project(center, normalized=True)]
                yy_new_start_head = float(np.interp(xx_new, xx, yy_start_heads)[0])
                yy_new_end_head = float(np.interp(xx_new, xx, yy_end_heads)[0])

                for layer_idx in layer_indices:
                    sp_data.set_value(time_step=stress_period_idx, layer=layer_idx, row=cell.row, column=cell.col, values=[yy_new_start_head, yy_new_end_head], sum_up_values=False)

    return sp_data


def calculate_stress_period_data(model: Model) -> ChdStressPeriodData | None:
    sp_data = ChdStressPeriodData()
    chd_boundaries = model.boundaries.get_boundaries_of_type(BoundaryType.constant_head)
    for chd_boundary in chd_boundaries:
        if not isinstance(chd_boundary, ConstantHeadBoundary):
            raise TypeError(f'Expected boundary of type {ConstantHeadBoundary.__name__} but got {type(chd_boundary)}')

        sp_data_boundary = calculate_chd_boundary_stress_period_data(
            spatial_discretization=model.spatial_discretization, time_discretization=model.time_discretization, layers=model.layers, chd_boundary=chd_boundary
        )
        sp_data = sp_data.merge(other=sp_data_boundary, sum_up_values=False)

    if sp_data.is_empty():
        return None

    return sp_data
