class EventPayloadBase:
    @classmethod
    def from_dict(cls, obj: dict):
        raise NotImplementedError()

    def to_dict(self) -> dict:
        raise NotImplementedError()
