import dataclasses
from typing import NewType

FileName = NewType('FileName', str)
FilePath = NewType('FilePath', str)
FileSize = NewType('FileSize', int)
MimeType = NewType('MimeType', str)


@dataclasses.dataclass(frozen=True)
class File:
    file_name: FileName
    size_in_bytes: FileSize
    mime_type: MimeType

    def to_dict(self):
        return dataclasses.asdict(self)

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            file_name=FileName(obj['file_name']),
            size_in_bytes=FileSize(obj['size_in_bytes']),
            mime_type=MimeType(obj['mime_type']),
        )
