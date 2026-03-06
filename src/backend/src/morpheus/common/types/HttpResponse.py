from dataclasses import dataclass, field
from typing import Any


@dataclass
class HttpResponse:
    data: Any = None
    status_code: int = 200
    headers: dict[str, str] = field(default_factory=dict)

    @classmethod
    def created(cls, location: str) -> 'HttpResponse':
        return cls(status_code=201, headers={'Location': location})

    @classmethod
    def no_content(cls) -> 'HttpResponse':
        return cls(status_code=204)

    @classmethod
    def error(cls, message: str, status_code: int = 400) -> 'HttpResponse':
        return cls(data={'error': message}, status_code=status_code)

    @classmethod
    def json(cls, data: Any, status_code: int = 200) -> 'HttpResponse':
        return cls(data=data, status_code=status_code)
