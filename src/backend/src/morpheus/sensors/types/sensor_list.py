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


@dataclasses.dataclass
class SensorsLatestValues:
    items: dict[str, dict[str, float]]

    def to_dict(self) -> dict[str, dict[str, float]]:
        return self.items


@dataclasses.dataclass
class SensorList:
    def __init__(self, items: list['SensorListItem']):
        self.items = items

    def to_dict(self) -> list[dict]:
        return [item.to_dict() for item in self.items]


@dataclasses.dataclass
class SensorListItem:
    id: str
    location: list[float]
    project: str
    name: str
    parameters: list[str]

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'location': self.location,
            'project': self.project,
            'name': self.name,
            'parameters': self.parameters
        }
