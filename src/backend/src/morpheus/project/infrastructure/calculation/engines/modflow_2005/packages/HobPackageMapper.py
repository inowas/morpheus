import dataclasses

from morpheus.common.types import Float, DateTime
from morpheus.project.types.Model import Model
from morpheus.project.types.observations.HeadObservation import Head, ObservationId, ObservationName


class TotalTime(Float):
    pass


@dataclasses.dataclass
class HeadObservationTimeSeriesItem:
    date_time: DateTime
    total_time: TotalTime
    head_value: Head

    def to_list(self) -> list[float]:
        return [self.total_time.to_value(), self.head_value.to_value()]


@dataclasses.dataclass
class HeadObservationItem:
    observation_id: ObservationId
    observation_name: ObservationName
    obs_name: str
    names: list[str]
    layer: int
    row: int
    column: int
    time_series_data: list[HeadObservationTimeSeriesItem]


@dataclasses.dataclass
class HeadObservationData:
    items: list[HeadObservationItem]

    def __iter__(self):
        return iter(self.items)

    @classmethod
    def new(cls):
        return cls(items=[])

    def add_item(self, item: HeadObservationItem):
        self.items.append(item)

    def is_empty(self):
        return len(self.items) == 0


def calculate_observation_items(model: Model) -> HeadObservationData:
    time_discretization = model.time_discretization

    head_observation_data = HeadObservationData.new()
    for observation in model.observations:
        data_items = observation.get_data_items(start=time_discretization.start_date_time, end=time_discretization.end_date_time)

        if len(data_items) == 0:
            continue

        # filter affected layers to only include layers that are part of the model
        layers = model.layers
        layer_ids = [layer.layer_id for layer in layers]
        affected_layers = [layer_id for layer_id in observation.affected_layers if layers.has_layer(layer_id)]
        layer_indices = [layer_ids.index(layer_id) for layer_id in affected_layers]

        if len(layer_indices) == 0:
            # if we have no affected layers
            # we do not apply any data for this stress period
            # We should log a warning here
            continue

        for layer_idx in layer_indices:
            for cell in observation.affected_cells:
                time_series_data = []
                for data_item in data_items:
                    time_series_data.append(HeadObservationTimeSeriesItem(
                        date_time=data_item.date_time,
                        total_time=TotalTime.from_float(time_discretization.get_total_time_from_date_time(data_item.date_time)),
                        head_value=data_item.head
                    ))

                    if len(time_series_data) == 0:
                        continue

                head_observation_data.add_item(item=HeadObservationItem(
                    observation_id=observation.id,
                    observation_name=observation.name,
                    obs_name=observation.id.to_str()[:6],
                    names=[f'{observation.id.to_str()[:6]}.{idx}' for idx in range(len(time_series_data))],
                    layer=layer_idx,
                    row=cell.row,
                    column=cell.col,
                    time_series_data=time_series_data
                ))

    return head_observation_data
