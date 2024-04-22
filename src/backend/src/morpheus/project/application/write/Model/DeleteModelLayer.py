import dataclasses
from typing import TypedDict

from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.layers.Layer import LayerId


class DeleteModelLayerCommandPayload(TypedDict):
    project_id: str
    model_id: str
    layer_id: str


@dataclasses.dataclass(frozen=True)
class DeleteModelLayerCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    layer_id: LayerId

    @classmethod
    def from_payload(cls, user_id: UserId, payload: DeleteModelLayerCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.new(),
            layer_id=LayerId.from_str(payload['layer_id']),
        )


class DeleteModelLayerCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: DeleteModelLayerCommand):
        raise Exception('Not implemented yet')
