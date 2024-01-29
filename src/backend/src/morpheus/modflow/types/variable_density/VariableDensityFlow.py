import dataclasses

from morpheus.common.types import Bool


class IsEnabled(Bool):
    pass


@dataclasses.dataclass
class VariableDensityFlow:
    is_enabled: IsEnabled
    viscosity_is_enabled: IsEnabled

    @classmethod
    def new(cls):
        return cls(
            is_enabled=IsEnabled.no(),
            viscosity_is_enabled=IsEnabled.no()
        )

    @classmethod
    def from_dict(cls, obj: dict | None):
        if obj is None:
            return cls.new()
        return cls(
            is_enabled=IsEnabled.from_value(obj['is_enabled']),
            viscosity_is_enabled=IsEnabled.from_value(obj['viscosity_is_enabled'])
        )

    def to_dict(self):
        return {
            'is_enabled': self.is_enabled.to_value(),
            'viscosity_is_enabled': self.viscosity_is_enabled.to_value()
        }
