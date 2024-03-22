import dataclasses
from typing import NewType

FileName = NewType('FileName', str)
FilePath = NewType('FilePath', str)
FileSize = NewType('FileSize', int)
MimeType = NewType('MimeType', str)


@dataclasses.dataclass(frozen=True)
class File:
    filename: FileName
    size: FileSize
    mimetype: MimeType

    def to_dict(self):
        return dataclasses.asdict(self)

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            filename=FileName(obj['filename']),
            size=FileSize(obj['size']),
            mimetype=MimeType(obj['mimetype']),
        )
