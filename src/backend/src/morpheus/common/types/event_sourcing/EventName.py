import dataclasses


@dataclasses.dataclass(frozen=True)
class EventName:
    name: str

    def __eq__(self, other):
        return self.name == other.name

    @classmethod
    def from_str(cls, name: str):
        return cls(name=name)

    def to_str(self):
        return self.name
