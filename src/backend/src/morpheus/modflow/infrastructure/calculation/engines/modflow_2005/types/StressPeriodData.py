import dataclasses

import numpy as np


@dataclasses.dataclass
class StressPeriodDataItem:
    time_step: int
    layer: int
    row: int
    column: int
    values: list[float]


class StressPeriodData:
    data: list[StressPeriodDataItem]

    def __init__(self, data: list[StressPeriodDataItem] | None = None):
        self.data = data or []

    def merge(self, other: 'StressPeriodData', sum_up_values: bool = False):
        for item in other.data:
            self.set_value(
                time_step=item.time_step,
                layer=item.layer,
                row=item.row,
                column=item.column,
                values=item.values,
                sum_up_values=sum_up_values
            )
        return self

    def set_value(self, time_step: int, row: int, column: int, values: list[float], layer: int = 0,
                  sum_up_values: bool = False):
        if time_step < 0:
            raise ValueError(f"Time step must be greater than or equal to 0. Got {time_step}")
        if layer < 0:
            raise ValueError(f"Layer must be greater than or equal to 0. Got {layer}")

        for item in self.data:
            if item.time_step == time_step and item.layer == layer and item.row == row and item.column == column:
                if sum_up_values:
                    item.values = [item_value + new_value for item_value, new_value in zip(item.values, values)]
                item.values = values
                return

        self.data.append(StressPeriodDataItem(
            time_step=time_step,
            layer=layer,
            row=row,
            column=column,
            values=values
        ))

    def is_empty(self):
        return len(self.data) == 0

    def to_dict(self) -> dict:
        sp_data = {}
        for item in self.data:
            sp_data.setdefault(item.time_step, [])
            sp_data[item.time_step].append_document([item.layer, item.row, item.column, *item.values])

        return sp_data

    @classmethod
    def from_dict(cls, obj: dict):
        sp_data = cls()
        for time_step, items in obj.items():
            for item in items:
                sp_data.set_value(
                    time_step=int(time_step),
                    layer=int(item[0]),
                    row=int(item[1]),
                    column=int(item[2]),
                    values=item[3:]
                )
        return sp_data


class LayerBasedStressPeriodData(StressPeriodData):
    # Shape of the 2D array (ny, nx)
    shape: tuple[int, int]
    data: list[StressPeriodDataItem]

    def __init__(self, nx: int, ny: int, data: list[StressPeriodDataItem] | None = None):
        super().__init__(data=data)
        self.shape = (ny, nx)

    def is_empty(self):
        return len(self.data) == 0

    def to_dict(self, idx: int = 0) -> dict:
        sp_data = {}
        sorted_list_of_unique_time_steps = sorted(list(set([item.time_step for item in self.data])))
        for time_step in sorted_list_of_unique_time_steps:
            sp_data.setdefault(time_step, np.zeros(self.shape).tolist())
            for item in self.data:
                sp_data[time_step][item.row][item.column] = item.values[idx]
        return sp_data
