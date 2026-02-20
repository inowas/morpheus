import dataclasses

from morpheus.common.types import Bool, DateTime, Float, String, Uuid


class IsEnabled(Bool):
    pass


class SubstanceName(String):
    pass


class SubstanceId(Uuid):
    pass


class ConcentrationDateTime(DateTime):
    pass


class ConcentrationValue(Float):
    pass


@dataclasses.dataclass
class ConcentrationDataItem:
    date_time: ConcentrationDateTime
    value: ConcentrationValue

    @classmethod
    def from_dict(cls, obj):
        return cls(date_time=ConcentrationDateTime.from_value(obj['date_time']), value=ConcentrationValue.from_value(obj['value']))

    def to_dict(self):
        return {'date_time': self.date_time.to_value(), 'value': self.value.to_value()}


@dataclasses.dataclass
class Substance:
    substance_id: SubstanceId
    name: SubstanceName
    concentrations: list[ConcentrationDataItem]

    @classmethod
    def from_dict(cls, obj):
        return cls(
            substance_id=SubstanceId.from_value(obj['substance_id']),
            name=SubstanceName.from_value(obj['name']),
            concentrations=[ConcentrationDataItem.from_dict(item) for item in obj['concentrations']],
        )

    def to_dict(self):
        return {'substance_id': self.substance_id.to_value(), 'name': self.name.to_value(), 'concentrations': [item.to_dict() for item in self.concentrations]}


@dataclasses.dataclass
class Transport:
    is_enabled: IsEnabled
    substances: list[Substance]

    @classmethod
    def new(cls):
        return cls(is_enabled=IsEnabled.no(), substances=[])

    @classmethod
    def from_dict(cls, obj: dict | None):
        if obj is None:
            return cls.new()

        return cls(is_enabled=IsEnabled.from_value(obj['is_enabled']), substances=[Substance.from_dict(item) for item in obj['substances']])

    def to_dict(self):
        return {'is_enabled': self.is_enabled.to_value(), 'substances': [item.to_dict() for item in self.substances]}
