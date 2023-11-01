import dataclasses


@dataclasses.dataclass
class Name:
    value: str

    @classmethod
    def from_str(cls, value: str):
        return cls(value=value)

    def to_str(self):
        return self.value


@dataclasses.dataclass
class Description:
    value: str

    @classmethod
    def from_str(cls, value: str):
        return cls(value=value)

    def to_str(self):
        return self.value


@dataclasses.dataclass
class Tags:
    value: list[str]

    @classmethod
    def from_list(cls, value: list[str]):
        return cls(value=value)

    def to_list(self):
        return self.value


@dataclasses.dataclass
class UserId:
    value: str

    @classmethod
    def from_str(cls, value: str):
        return cls(value=value)

    def to_str(self):
        return self.value


@dataclasses.dataclass
class Metadata:
    name: Name
    description: Description
    tags: Tags
    user: UserId

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            name=Name.from_str(obj['name']),
            description=Description.from_str(obj['description']),
            tags=Tags.from_list(obj['tags']),
            user=UserId.from_str(obj['owner'])
        )

    def to_dict(self):
        return {
            'name': self.name.to_str(),
            'description': self.description.to_str(),
            'tags': self.tags.to_list(),
            'owner': self.user.to_str()
        }