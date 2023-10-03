import dataclasses


@dataclasses.dataclass(frozen=True)
class UserProfile:
    email: str

    def __post_init__(self):
        if len(self.email) <= 0 or len(self.email) > 255:
            raise ValueError('User email must not be empty and have a maximum of 255 characters')
