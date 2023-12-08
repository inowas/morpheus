import numpy as np
from shapely import LineString as ShapelyLineString, Point as ShapelyPoint

from morpheus.modflow.infrastructure.calculation.modflow_2005.types.StressPeriodData import StressPeriodData
from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.modflow.types.boundaries.Boundary import BoundaryType, GeneralHeadBoundary
from morpheus.modflow.types.boundaries.GeneralHeadObservation import GeneralHeadDataItem

from morpheus.modflow.types.discretization import TimeDiscretization, SpatialDiscretization
from morpheus.modflow.types.soil_model import SoilModel


class GhbStressPeriodData(StressPeriodData):
    pass


def calculate_ghb_boundary_stress_period_data(
    spatial_discretization: SpatialDiscretization,
    time_discretization: TimeDiscretization,
    soil_model: SoilModel,
    ghb_boundary: GeneralHeadBoundary
) -> GhbStressPeriodData:
    layer_ids = [layer.id for layer in soil_model.layers]
    sp_data = GhbStressPeriodData()

    # first we need to calculate the mean values for each observation point and each stress period
    for stress_period_idx, stress_period in enumerate(time_discretization.stress_periods):
        start_date_time = time_discretization.get_start_date_times()[stress_period_idx]
        end_date_time = time_discretization.get_end_date_times()[stress_period_idx]
        mean_data = ghb_boundary.get_mean_data(start_date_time, end_date_time)

        if ghb_boundary.number_of_observations() == 0 or None in mean_data:
            # if we have no observation points
            # or if we have inconsistent or no observation data for this stress period
            # we do not apply any data for this stress period
            continue

        layer_indices = [layer_ids.index(layer_id) for layer_id in ghb_boundary.affected_layers]

        # we need to filter the affected cells to only include cells that are part of the model
        ghb_boundary.affected_cells = ghb_boundary.affected_cells.filter(
            lambda cell: spatial_discretization.affected_cells.contains(cell))

        if ghb_boundary.number_of_observations() == 1:
            # if we only have one observation point
            # we can apply the one mean data item for each affected cell

            mean_data = mean_data[0]
            if not isinstance(mean_data, GeneralHeadDataItem):
                raise TypeError("Expected GeneralHeadDataItem but got {}".format(type(mean_data)))

            stage = mean_data.stage
            conductance = mean_data.conductance

            for cell in ghb_boundary.affected_cells:
                if not spatial_discretization.affected_cells.contains(cell):
                    # if the cell is not part of the model
                    # we do not apply any data for this cell
                    continue

                for layer_idx in layer_indices:
                    sp_data.set_value(time_step=stress_period_idx, layer=layer_idx, row=cell.y, column=cell.x,
                                      values=[stage.to_float(), conductance.to_float()], sum_to_existing=False)

        if ghb_boundary.number_of_observations() > 1:
            # if we have multiple observation points
            # we need to interpolate the mean data for each affected cell ;(
            line_string = ShapelyLineString(ghb_boundary.geometry.coordinates)

            xx: list[float] = []
            yy_stages: list[float] = []
            yy_conductances = []
            for observation in ghb_boundary.observations:
                shapely_point = ShapelyPoint(observation.geometry.coordinates)
                xx.append(line_string.project(shapely_point, normalized=True))

                mean_data = observation.get_data_item(start_date_time, end_date_time)
                if not isinstance(mean_data, GeneralHeadDataItem):
                    raise TypeError("Expected GeneralHeadDataItem but got {}".format(type(mean_data)))

                yy_stages.append(mean_data.stage.to_float())
                yy_conductances.append(mean_data.conductance.to_float())

            grid_cell_centers = spatial_discretization.grid.get_cell_centers()
            for cell in ghb_boundary.affected_cells:
                if spatial_discretization.affected_cells.get_cell(cell.x, cell.y) is None:
                    # if the cell is not part of the model
                    # we do not apply any data for this cell
                    continue

                center = ShapelyPoint(grid_cell_centers[cell.x][cell.y].coordinates)
                xx_new = [line_string.project(center, normalized=True)]
                yy_new_stage = float(np.interp(xx_new, xx, yy_stages)[0])
                yy_new_conductance = float(np.interp(xx_new, xx, yy_conductances)[0])

                for layer_idx in layer_indices:
                    sp_data.set_value(time_step=stress_period_idx, layer=layer_idx, row=cell.y, column=cell.x,
                                      values=[yy_new_stage, yy_new_conductance], sum_to_existing=False)

    return sp_data


def calculate_stress_period_data(model: ModflowModel) -> GhbStressPeriodData | None:
    sp_data = GhbStressPeriodData()
    ghb_boundaries = model.boundaries.get_boundaries_of_type(BoundaryType.general_head())
    for ghb_boundary in ghb_boundaries:
        sp_data_boundary = calculate_ghb_boundary_stress_period_data(
            spatial_discretization=model.spatial_discretization,
            time_discretization=model.time_discretization,
            soil_model=model.soil_model,
            ghb_boundary=ghb_boundary
        )
        sp_data = sp_data.merge(other=sp_data_boundary, sum_to_existing=False)

    if sp_data.is_empty():
        return None

    return sp_data
