import dataclasses

from morpheus.common.types import String, Uuid


class VersionId(Uuid):
    pass


class VersionTag(String):
    pass


class VersionDescription(String):
    pass


class Hash(String):
    pass


@dataclasses.dataclass(frozen=True)
class ModelVersion:
    version_id: VersionId
    tag: VersionTag
    description: VersionDescription

    def __str__(self):
        return self.tag.to_str()

    @classmethod
    def new(cls, tag: VersionTag, description: VersionDescription):
        return cls(version_id=VersionId.new(), tag=tag, description=description)

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            version_id=VersionId.from_str(obj['version_id']),
            tag=VersionTag.from_str(obj['tag']),
            description=VersionDescription.from_str(obj['description']),
        )

    def to_dict(self) -> dict:
        return {
            'version_id': self.version_id.to_str(),
            'tag': self.tag.to_str(),
            'description': self.description.to_str(),
        }

    def to_str(self) -> str:
        return self.tag.to_str()
