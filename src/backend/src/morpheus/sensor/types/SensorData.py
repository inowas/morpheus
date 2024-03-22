import dataclasses


@dataclasses.dataclass
class SensorData:
    def __init__(self, items: list['SensorDataItem']):
        self.items = items

    def to_dict(self) -> list[dict]:
        return [item.to_dict() for item in self.items]


@dataclasses.dataclass
class SensorDataItem:
    date_time: str
    value: float | None

    def to_dict(self) -> dict:
        return {
            'date_time': self.date_time,
            'value': self.value
        }
