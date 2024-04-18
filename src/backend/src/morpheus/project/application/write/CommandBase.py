import dataclasses
from typing import Any

import inflection

from morpheus.project.types.User import UserId


@dataclasses.dataclass(frozen=True)
class CommandBase:
    user_id: UserId

    @classmethod
    def command_name(cls) -> str:
        return inflection.underscore(cls.__name__)

    @classmethod
    def from_payload(cls, user_id: UserId, payload: Any):
        raise NotImplementedError