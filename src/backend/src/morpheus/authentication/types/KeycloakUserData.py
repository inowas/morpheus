import dataclasses


@dataclasses.dataclass
class KeycloakUserData:
    user_id: str
    username: str
    email: str
    first_name: str | None
    last_name: str | None
    roles: list[str]
