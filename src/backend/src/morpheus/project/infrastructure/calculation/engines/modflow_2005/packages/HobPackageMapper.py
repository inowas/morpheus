import dataclasses

from morpheus.common.types import Float
from morpheus.project.types.Model import Model
from morpheus.project.types.observations.Observation import HeadValue


class TotalTime(Float):
    pass


@dataclasses.dataclass
class HeadObservationTimeSeriesItem:
    total_time: TotalTime
    head_value: HeadValue

    def to_list(self) -> list[float]:
        return [self.total_time.to_value(), self.head_value.to_value()]


@dataclasses.dataclass
class HeadObservationItem:
    name: str
    layer: int
    row: int
    column: int
    time_series_data: list[HeadObservationTimeSeriesItem]

    def to_dict(self) -> dict:
        return {
            'name': self.name,
            'layer': self.layer,
            'row': self.row,
            'column': self.column,
            'time_series_data': [item.to_list() for item in self.time_series_data]
        }


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
    soil_model = model.layers
    time_discretization = model.time_discretization

    layer_ids = [layer.id for layer in soil_model.layers]

    head_observation_data = HeadObservationData.new()
    for observation in model.observations:
        layer_indices = [layer_ids.index(layer_id) for layer_id in observation.affected_layers]
        data_items = observation.get_data_items(start=time_discretization.start_date_time,
                                                end=time_discretization.end_date_time)

        if len(data_items) == 0:
            continue

        for layer_idx in layer_indices:
            for cell in observation.affected_cells:
                time_series_data = []
                for data_item in data_items:
                    time_series_data.append(HeadObservationTimeSeriesItem(
                        total_time=TotalTime.from_float(
                            time_discretization.get_total_time_from_date_time(data_item.date_time)
                        ),
                        head_value=data_item.head_value
                    ))

                    if len(time_series_data) == 0:
                        continue

                head_observation_data.add_item(item=HeadObservationItem(
                    name=observation.name.to_value(),
                    layer=layer_idx,
                    row=cell.row,
                    column=cell.col,
                    time_series_data=time_series_data
                ))

    return head_observation_data
