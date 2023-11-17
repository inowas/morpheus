import dataclasses


@dataclasses.dataclass
class ChdPackageData:
    stress_period_data: dict[int, list[list[float]]] = None
    dtype: None | list = None
    options: None | list = None
    extension: str = "chd"
    unitnumber: None | int = None
    filenames: None | str | list[str] = None,

    @staticmethod
    def custom_defaults() -> dict:
        return {}

    def with_custom_values(self, custom_values: dict):
        return ChdPackageData(**{**dataclasses.asdict(self), **custom_values})

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)
