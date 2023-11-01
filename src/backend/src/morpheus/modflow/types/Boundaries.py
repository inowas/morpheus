import dataclasses


@dataclasses.dataclass(frozen=True)
class Boundary:
    type: str

    @classmethod
    def from_dict(cls, obj):
        return cls(
            type=obj['type']
        )

    def to_dict(self):
        return {
            'type': self.type
        }


@dataclasses.dataclass
class BoundaryCollection:
    boundaries: list[Boundary]

    @classmethod
    def from_default(cls):
        return cls(boundaries=[])

    @classmethod
    def from_list(cls, collection: list):
        return cls(boundaries=[Boundary.from_dict(b) for b in collection])

    def to_list(self):
        return [b.to_dict() for b in self.boundaries]
