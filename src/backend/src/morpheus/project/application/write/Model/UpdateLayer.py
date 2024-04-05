import dataclasses
from typing import TypedDict, Literal, Optional

from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.soil_model.Layer import LayerName, LayerDescription, LayerType, LayerId


class UpdateLayerCommandPayload(TypedDict):
    project_id: str
    model_id: str
    layer_id: str
    name: Optional[str]
    description: Optional[str]
    type: Optional[Literal['confined', 'convertible', 'unconfined']]
    kx: Optional[float | list[list[float]]]
    ky: Optional[float | list[list[float]]]
    kz: Optional[float | list[list[float]]]
    specific_storage: Optional[float | list[list[float]]]
    specific_yield: Optional[float | list[list[float]]]
    initial_head: Optional[float | list[list[float]]]
    top: Optional[float | list[list[float]]]
    bottom: Optional[float | list[list[float]]]


@dataclasses.dataclass(frozen=True)
class UpdateLayerCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    layer_id: LayerId
    name: Optional[LayerName]
    description: Optional[LayerDescription]
    type: Optional[LayerType]
    kx: Optional[float | list[list[float]]]
    ky: Optional[float | list[list[float]]]
    kz: Optional[float | list[list[float]]]
    specific_storage: Optional[float | list[list[float]]]
    specific_yield: Optional[float | list[list[float]]]
    initial_head: Optional[float | list[list[float]]]
    top: Optional[float | list[list[float]]]
    bottom: Optional[float | list[list[float]]]

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateLayerCommandPayload):
        layer_type_string = payload['type']
        layer_type = LayerType.from_str(layer_type_string) if layer_type_string else None
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.new(),
            layer_id=LayerId.from_str(payload['layer_id']),
            name=LayerName.from_str(payload['name']) if payload['name'] else None,
            description=LayerDescription.from_str(payload['description']) if payload['description'] else None,
            type=layer_type,
            kx=payload['kx'] if 'kx' in payload else None,
            ky=payload['ky'] if 'ky' in payload else None,
            kz=payload['kz'] if 'kz' in payload else None,
            specific_storage=payload['specific_storage'] if 'specific_storage' in payload else None,
            specific_yield=payload['specific_yield'] if 'specific_yield' in payload else None,
            initial_head=payload['initial_head'] if 'initial_head' in payload else None,
            top=payload['top'] if 'top' in payload else None,
            bottom=payload['bottom'] if 'bottom' in payload else None,
        )


class UpdateLayerCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateLayerCommand):
        raise Exception('Not implemented yet')
