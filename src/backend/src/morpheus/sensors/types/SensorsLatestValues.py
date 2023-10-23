import dataclasses


@dataclasses.dataclass
class SensorsLatestValues:
    items: dict[str, dict]

    def to_dict(self) -> dict[str, dict]:
        return self.items
