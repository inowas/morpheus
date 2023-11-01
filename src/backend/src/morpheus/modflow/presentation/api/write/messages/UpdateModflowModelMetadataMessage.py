import dataclasses
from typing_extensions import TypedDict, Literal
from pydantic import BaseModel


class UpdateModflowModelMetadataMessage(TypedDict):
    name: str
    description: str
    tags: list[str]


@dataclasses.dataclass(frozen=True)
class UpdateModflowModelMetadataMessage(BaseModel):
    uuid: str
    payload: UpdateModflowModelMetadataMessage
    message_name: Literal['update_modflow_model_metadata'] = 'update_modflow_model_metadata'

    def to_dict(self):
        return {
            'uuid': self.uuid,
            'message_name': self.message_name,
            'payload': self.payload
        }

    @staticmethod
    def from_dict(cls, obj: dict):
        return cls(
            uuid=obj['uuid'],
            payload=obj['payload']
        )
