import dataclasses
from morpheus.common.types import Uuid


@dataclasses.dataclass(frozen=True)
class EventMetadata:
    obj: dict

    @classmethod
    def without_creator(cls, obj: dict | None = None):
        if obj is None:
            obj = {}
        return cls(obj)

    @classmethod
    def with_creator(cls, user_id: Uuid, obj: dict | None = None):
        if obj is None:
            obj = {}
        return cls(
            obj={'created_by': user_id.to_str(), **obj}
        )

    def get_created_by(self) -> Uuid:
        if 'created_by' not in self.obj:
            return Uuid.from_str('00000000-0000-0000-0000-000000000000')
        return Uuid.from_str(self.obj['created_by'])

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(obj=obj)

    def to_dict(self):
        return self.obj
