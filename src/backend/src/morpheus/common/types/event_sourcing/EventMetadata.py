import dataclasses


@dataclasses.dataclass(frozen=True)
class EventMetadata:
    obj: dict

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(obj)

    def to_dict(self) -> dict:
        return self.obj
