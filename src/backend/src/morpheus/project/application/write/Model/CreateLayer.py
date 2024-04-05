import dataclasses
from typing import TypedDict, Literal, Optional

from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.soil_model.Layer import LayerName, LayerDescription, LayerType, LayerData, LayerId


class CreateLayerCommandPayload(TypedDict):
    project_id: str
    model_id: str
    name: str
    description: str
    type: Literal['confined', 'convertible', 'unconfined']
    kx: float | list[list[float]]
    ky: float | list[list[float]]
    kz: float | list[list[float]]
    specific_storage: float | list[list[float]]
    specific_yield: float | list[list[float]]
    initial_head: float | list[list[float]]
    top: Optional[float | list[list[float]]]
    bottom: float | list[list[float]]


@dataclasses.dataclass(frozen=True)
class CreateLayerCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    layer_id: LayerId
    name: LayerName
    description: LayerDescription
    type: LayerType
    data: LayerData

    @classmethod
    def from_payload(cls, user_id: UserId, payload: CreateLayerCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            layer_id=LayerId.new(),
            name=LayerName.from_str(payload['name']),
            description=LayerDescription.from_str(payload['description']),
            type=LayerType.from_str(payload['type']),
            data=LayerData.from_dict({
                'kx': payload['kx'],
                'ky': payload['ky'],
                'kz': payload['kz'],
                'specific_storage': payload['specific_storage'],
                'specific_yield': payload['specific_yield'],
                'initial_head': payload['initial_head'],
                'top': payload['top'],
                'bottom': payload['bottom'],
            }),
        )


class CreateLayerCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: CreateLayerCommand):
        raise Exception('Not implemented yet')
