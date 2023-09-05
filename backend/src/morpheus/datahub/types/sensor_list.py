import dataclasses


@dataclasses.dataclass
class SensorListWithLatestValues:
    items: dict[str, dict[str, float]]

    def to_dict(self) -> dict[str, dict[str, float]]:
        return self.items
