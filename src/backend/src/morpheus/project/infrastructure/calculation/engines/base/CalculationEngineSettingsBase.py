import dataclasses


@dataclasses.dataclass
class CalculationEngineSettingsBase:
    def to_dict(self) -> dict:
        raise NotImplementedError

    @classmethod
    def from_dict(cls, obj: dict):
        raise NotImplementedError
