import dataclasses

import numpy as np
from shapely import LineString as ShapelyLineString, Point as ShapelyPoint

from morpheus.project.types.Model import Model
from morpheus.project.types.boundaries.Boundary import BoundaryType, FlowAndHeadBoundary
from morpheus.project.types.boundaries.FlowAndHeadObservation import FlowDataItem, HeadDataItem, StartDateTime, \
    FlowAndHeadObservation


@dataclasses.dataclass
class TimeStepValuesItem:
    layer: int
    row: int
    column: int
    values: list[float | None]


class FhbStressPeriodData:
    date_times: list[StartDateTime]
    total_times: list[float]
    flow_data: list[TimeStepValuesItem]
    head_data: list[TimeStepValuesItem]

    def __len__(self):
        return len(self.head_data)

    def __init__(self, date_times: list[StartDateTime], total_times: list[float]):
        self.date_times = date_times
        self.total_times = total_times
        self.flow_data = []
        self.head_data = []

    def set_flow_value(self, time_step: int, row: int, column: int, value: float, layer: int):
        if time_step < 0:
            raise ValueError(f"Time step must be greater than or equal to 0. Got {time_step}")

        for item in self.flow_data:
            if item.layer == layer and item.row == row and item.column == column:
                item.values[time_step] = value
                return

        values: list[float | None] = [None] * len(self.total_times)
        values[time_step] = value

        self.flow_data.append(TimeStepValuesItem(
            layer=layer,
            row=row,
            column=column,
            values=values
        ))

    def set_head_value(self, time_step: int, row: int, column: int, value: float, layer: int):
        if time_step < 0:
            raise ValueError(f"Time step must be greater than or equal to 0. Got {time_step}")

        for item in self.head_data:
            if item.layer == layer and item.row == row and item.column == column:
                item.values[time_step] = value
                return

        values: list[float | None] = [None] * len(self.total_times)
        values[time_step] = value

        self.head_data.append(TimeStepValuesItem(
            layer=layer,
            row=row,
            column=column,
            values=values
        ))

    def is_empty(self):
        return len(self.head_data) == 0

    def get_ds5(self):
        result = []
        for item in self.flow_data:
            if None in item.values:
                continue
            result.append([item.layer, item.row, item.column, 0, *item.values])

        return result

    def get_ds7(self):
        result = []
        for item in self.head_data:
            if None in item.values:
                continue
            result.append([item.layer, item.row, item.column, 0, *item.values])

        return result

    def to_dict(self):
        return {
            'date_times': self.date_times,
            'total_times': self.total_times,
            'flow_data': self.flow_data,
            'head_data': self.head_data
        }


def get_date_times(model: Model) -> list[StartDateTime]:
    fhb_boundaries = model.boundaries.get_boundaries_of_type(BoundaryType.flow_and_head())
    if len(fhb_boundaries) == 0:
        return []

    date_times = []
    for fhb_boundary in fhb_boundaries:
        if not isinstance(fhb_boundary, FlowAndHeadBoundary):
            raise TypeError("Expected FlowAndHeadBoundary but got {}".format(type(fhb_boundary)))
        boundary_date_times = fhb_boundary.get_date_times()
        for boundary_date_time in boundary_date_times:
            if boundary_date_time < model.time_discretization.start_date_time:
                continue
            if boundary_date_time > model.time_discretization.end_date_time:
                continue
            if boundary_date_time in date_times:
                continue

            date_times.append(boundary_date_time)

    date_times.sort(key=lambda date_time: date_time.to_datetime())
    return date_times


def get_total_times(date_times: list[StartDateTime], model: Model) -> list[float]:
    total_times = []
    for date_time in date_times:
        total_times.append(model.time_discretization.get_total_time_from_date_time(date_time))
    return total_times


def calculate_fhb_boundary_stress_period_data(model: Model) -> FhbStressPeriodData | None:
    spatial_discretization = model.spatial_discretization
    fhb_boundaries = model.boundaries.get_boundaries_of_type(BoundaryType.flow_and_head())

    if len(fhb_boundaries) == 0:
        return None

    date_times = get_date_times(model)
    total_times = get_total_times(date_times, model)
    layer_ids = [layer.id for layer in model.layers.layers]

    fhb_stress_period_data = FhbStressPeriodData(date_times, total_times)

    # first we need to calculate the mean values for each observation point and date_time
    for date_time_idx, date_time in enumerate(date_times):
        if not isinstance(date_time, StartDateTime):
            raise TypeError("Expected StartDateTime but got {}".format(type(date_time)))

        # calculate the mean head data for each boundary
        for fhb_boundary in fhb_boundaries:
            if not isinstance(fhb_boundary, FlowAndHeadBoundary):
                raise TypeError("Expected FlowAndHeadBoundary but got {}".format(type(fhb_boundary)))

            mean_head_data = fhb_boundary.get_head_data(date_time)
            if fhb_boundary.number_of_observations() == 0 or None in mean_head_data:
                # if we have no observation points
                # or if we have inconsistent or no observation data for this stress period
                # we do not apply any data for this stress period
                continue

            layer_indices = [layer_ids.index(layer_id) for layer_id in fhb_boundary.affected_layers]

            # we need to filter the affected cells to only include cells that are part of the model
            fhb_boundary.affected_cells = fhb_boundary.affected_cells.filter(
                lambda affected_cell: spatial_discretization.affected_cells.contains(affected_cell))

            if fhb_boundary.number_of_observations() == 1:
                # if we only have one observation point
                # we can apply the one mean data item for each affected cell

                mean_head_data = mean_head_data[0]
                value = None
                if isinstance(mean_head_data, HeadDataItem):
                    value = mean_head_data.head.to_float()

                if value is None:
                    raise TypeError("Expected HeadDataItem but got {}".format(type(mean_head_data)))

                for cell in fhb_boundary.affected_cells:
                    if not spatial_discretization.affected_cells.contains(cell):
                        # if the cell is not part of the model
                        # we do not apply any data for this cell
                        continue

                    for layer_idx in layer_indices:
                        fhb_stress_period_data.set_head_value(
                            time_step=date_time_idx, layer=layer_idx, row=cell.row, column=cell.col, value=value
                        )

            if fhb_boundary.number_of_observations() > 1:
                # if we have multiple observation points
                # we need to interpolate the mean data for each affected cell ;(
                line_string = ShapelyLineString(fhb_boundary.geometry.coordinates)
                observations = fhb_boundary.get_observations()
                observations.sort(
                    key=lambda obs: line_string.project(ShapelyPoint(obs.geometry.coordinates), normalized=True)
                )

                xx: list[float] = []
                yy_values: list[float] = []
                for observation in observations:

                    if not isinstance(observation, FlowAndHeadObservation):
                        raise TypeError("Expected FlowAndHeadObservation but got {}".format(type(observation)))

                    shapely_point = ShapelyPoint(observation.geometry.coordinates)
                    xx.append(line_string.project(shapely_point, normalized=True))

                    mean_head_data = observation.get_head_data_item(date_time)
                    if isinstance(mean_head_data, HeadDataItem):
                        yy_values.append(mean_head_data.head.to_float())

                grid_cell_centers = spatial_discretization.grid.get_cell_centers()
                for cell in fhb_boundary.affected_cells:
                    if spatial_discretization.affected_cells.is_active(cell.col, cell.row) is None:
                        # if the cell is not part of the model
                        # we do not apply any data for this cell
                        continue

                    center = ShapelyPoint(grid_cell_centers[cell.col][cell.row].coordinates)
                    xx_new = [line_string.project(center, normalized=True)]
                    yy_new_value = float(np.interp(xx_new, xx, yy_values)[0])

                    for layer_idx in layer_indices:
                        fhb_stress_period_data.set_head_value(
                            time_step=date_time_idx, layer=layer_idx, row=cell.row, column=cell.col, value=yy_new_value
                        )

        # calculate the mean flow data for each boundary
        for fhb_boundary in fhb_boundaries:

            if not isinstance(fhb_boundary, FlowAndHeadBoundary):
                raise TypeError("Expected FlowAndHeadBoundary but got {}".format(type(fhb_boundary)))

            mean_flow_data = fhb_boundary.get_flow_data(date_time)
            if fhb_boundary.number_of_observations() == 0 or None in mean_flow_data:
                # if we have no observation points
                # or if we have inconsistent or no observation data for this stress period
                # we do not apply any data for this stress period
                continue

            layer_indices = [layer_ids.index(layer_id) for layer_id in fhb_boundary.affected_layers]

            # we need to filter the affected cells to only include cells that are part of the model
            fhb_boundary.affected_cells = fhb_boundary.affected_cells.filter(
                lambda affected_cell: spatial_discretization.affected_cells.contains(affected_cell))

            if fhb_boundary.number_of_observations() == 1:
                # if we only have one observation point
                # we can apply the one mean data item for each affected cell

                mean_flow_data = mean_flow_data[0]
                value = None
                if isinstance(mean_flow_data, FlowDataItem):
                    value = mean_flow_data.flow.to_float()

                if value is None:
                    raise TypeError("Expected FlowDataItem but got {}".format(type(mean_flow_data)))

                for cell in fhb_boundary.affected_cells:
                    if not spatial_discretization.affected_cells.contains(cell):
                        # if the cell is not part of the model
                        # we do not apply any data for this cell
                        continue

                    for layer_idx in layer_indices:
                        fhb_stress_period_data.set_flow_value(
                            time_step=date_time_idx, layer=layer_idx, row=cell.row, column=cell.col, value=value
                        )

            if fhb_boundary.number_of_observations() > 1:
                # if we have multiple observation points
                # we need to interpolate the mean data for each affected cell ;(
                line_string = ShapelyLineString(fhb_boundary.geometry.coordinates)
                observations = fhb_boundary.get_observations()
                observations.sort(
                    key=lambda obs: line_string.project(ShapelyPoint(obs.geometry.coordinates), normalized=True)
                )

                xx: list[float] = []
                yy_values: list[float] = []
                for observation in observations:

                    if not isinstance(observation, FlowAndHeadObservation):
                        raise TypeError("Expected FlowAndHeadObservation but got {}".format(type(observation)))

                    shapely_point = ShapelyPoint(observation.geometry.coordinates)
                    xx.append(line_string.project(shapely_point, normalized=True))

                    mean_flow_data = observation.get_flow_data_item(date_time)

                    if isinstance(mean_flow_data, FlowDataItem):
                        yy_values.append(mean_flow_data.flow.to_float())

                grid_cell_centers = spatial_discretization.grid.get_cell_centers()
                for cell in fhb_boundary.affected_cells:
                    if spatial_discretization.affected_cells.is_active(cell.col, cell.row) is None:
                        # if the cell is not part of the model
                        # we do not apply any data for this cell
                        continue

                    center = ShapelyPoint(grid_cell_centers[cell.col][cell.row].coordinates)
                    xx_new = [line_string.project(center, normalized=True)]
                    yy_new_value = float(np.interp(xx_new, xx, yy_values)[0])

                    for layer_idx in layer_indices:
                        fhb_stress_period_data.set_flow_value(
                            time_step=date_time_idx, layer=layer_idx, row=cell.row, column=cell.col, value=yy_new_value
                        )

    return fhb_stress_period_data
