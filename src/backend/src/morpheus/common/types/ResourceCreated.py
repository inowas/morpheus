from dataclasses import dataclass, field


@dataclass
class ResourceCreated:
    location: str = field(init=False)

    def __init__(self, location: str) -> None:
        self.location = location
