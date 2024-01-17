import dataclasses
from morpheus.common.types import String


class Name(String):
    pass


class Description(String):
    pass


@dataclasses.dataclass
class Tags:
    value: list[str]

    @classmethod
    def from_list(cls, value: list[str]):
        return cls(value=value)

    @classmethod
    def from_value(cls, value: list[str]):
        return cls.from_list(value=value)

    def to_list(self):
        return self.value

    def to_value(self):
        return self.to_list()


@dataclasses.dataclass
class Metadata:
    name: Name
    description: Description
    tags: Tags

    @classmethod
    def new(cls):
        return cls(
            name=Name('New Model'),
            description=Description('New Model description'),
            tags=Tags([])
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            name=Name.from_value(obj['name']),
            description=Description.from_value(obj['description']),
            tags=Tags.from_value(obj['tags']),
        )

    def to_dict(self):
        return {
            'name': self.name.to_value(),
            'description': self.description.to_value(),
            'tags': self.tags.to_value(),
        }

    def with_updated_name(self, name: Name):
        return dataclasses.replace(self, name=name)

    def with_updated_description(self, description: Description):
        return dataclasses.replace(self, description=description)

    def with_updated_tags(self, tags: Tags):
        return dataclasses.replace(self, tags=tags)
