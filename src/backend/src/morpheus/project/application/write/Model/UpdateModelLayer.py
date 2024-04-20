import dataclasses
from typing import TypedDict, Literal, Optional

from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.soil_model.Layer import LayerName, LayerDescription, LayerType, LayerId


class UpdateModelLayerCommandPayload(TypedDict):
    project_id: str
    model_id: str
    layer_id: str
    name: Optional[str]
    description: Optional[str]
    type: Optional[Literal['confined', 'convertible', 'unconfined']]


@dataclasses.dataclass(frozen=True)
class UpdateModelLayerCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    layer_id: LayerId
    name: Optional[LayerName]
    description: Optional[LayerDescription]
    type: Optional[LayerType]

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelLayerCommandPayload):
        layer_type_string = payload['type']
        layer_type = LayerType.from_str(layer_type_string) if layer_type_string else None
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            layer_id=LayerId.from_str(payload['layer_id']),
            name=LayerName.from_str(payload['name']) if payload['name'] else None,
            description=LayerDescription.from_str(payload['description']) if payload['description'] else None,
            type=layer_type,
        )


class UpdateModelLayerCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelLayerCommand):
        raise Exception('Not implemented yet')
