import dataclasses


@dataclasses.dataclass
class StressPeriodDataItem:
    time_step: int
    layer: int
    row: int
    column: int
    values: list[float]


class StressPeriodData:
    data: list[StressPeriodDataItem]

    def __init__(self, data: list[StressPeriodDataItem] = None):
        self.data = data or []

    def merge(self, other: 'StressPeriodData', sum_to_existing: bool = False):
        for item in other.data:
            self.set_value(
                time_step=item.time_step,
                layer=item.layer,
                row=item.row,
                column=item.column,
                values=item.values,
                sum_to_existing=sum_to_existing
            )
        return self

    def set_value(self, time_step: int, layer: int, row: int, column: int, values: list[float],
                  sum_to_existing: bool = False):
        if time_step < 0:
            raise ValueError(f"Time step must be greater than or equal to 0. Got {time_step}")
        if layer < 0:
            raise ValueError(f"Layer must be greater than or equal to 0. Got {layer}")
        for value in values:
            if value < 0:
                raise ValueError(f"Value must be greater than or equal to 0. Got {value}")

        for item in self.data:
            if item.time_step == time_step and item.layer == layer and item.row == row and item.column == column:
                if sum_to_existing:
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

    def to_dict(self) -> dict:
        sp_data = {}
        for item in self.data:
            sp_data.setdefault(item.time_step, [])
            sp_data[item.time_step].append([item.layer, item.row, item.column, *item.values])

        return sp_data
