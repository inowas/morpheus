import dataclasses


@dataclasses.dataclass(frozen=True)
class EventMetadata:
    created_by: str
    rest: dict

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            created_by=obj['created_by'],
            rest=obj
        )

    def to_dict(self):
        rest = self.rest.copy()
        rest['created_by'] = self.created_by
        return rest
