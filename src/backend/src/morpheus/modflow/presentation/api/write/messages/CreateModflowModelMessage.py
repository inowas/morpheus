import dataclasses
from typing_extensions import TypedDict, Literal
from pydantic import BaseModel


class Polygon(TypedDict):
    type: Literal['polygon']
    coordinates: list[list[tuple[float, float]]]


class Grid(TypedDict):
    rows: list[float]
    columns: list[float]


class CreateModflowModelMessagePayload(TypedDict):
    name: str
    description: str
    tags: list[str]
    geometry: Polygon
    grid: Grid
    length_unit: Literal['feet', 'meters', 'centimeters', 'unknown']
    rotation: float
    crs: str


@dataclasses.dataclass(frozen=True)
class CreateModflowModelMessage(BaseModel):
    uuid: str
    payload: CreateModflowModelMessagePayload
    message_name: Literal['create_modflow_model'] = 'create_modflow_model'

    def to_dict(self):
        return {
            'uuid': self.uuid,
            'payload': self.payload
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            uuid=obj['uuid'],
            payload=obj['payload'],
            message_name='create_modflow_model'
        )
