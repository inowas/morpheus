import dataclasses
from typing import TypedDict, Literal, Optional

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents import ModelLayerCreatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.layers.Layer import LayerName, LayerDescription, LayerType, LayerProperties, LayerId, Layer


class CreateModelLayerCommandPayload(TypedDict):
    project_id: str
    model_id: str
    name: str
    description: str
    type: Literal['confined', 'convertible', 'unconfined']
    kx: float
    ky: float
    kz: float
    specific_storage: float
    specific_yield: float
    initial_head: float
    top: Optional[float]
    bottom: float


@dataclasses.dataclass(frozen=True)
class CreateModelLayerCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    layer_id: LayerId
    name: LayerName
    description: LayerDescription
    type: LayerType
    properties: LayerProperties

    @classmethod
    def from_payload(cls, user_id: UserId, payload: CreateModelLayerCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            layer_id=LayerId.new(),
            name=LayerName.from_str(payload['name']),
            description=LayerDescription.from_str(payload['description']),
            type=LayerType.from_str(payload['type']),
            properties=LayerProperties.from_values(
                kx=payload['kx'], ky=payload['ky'], kz=payload['kz'], specific_storage=payload['specific_storage'], specific_yield=payload['specific_yield'],
                initial_head=payload['initial_head'], top=payload['top'], bottom=payload['bottom']
            ),
        )


class CreateModelLayerCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: CreateModelLayerCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the time discretization of {project_id.to_str()}')

        event = ModelLayerCreatedEvent.from_layer(
            project_id=project_id,
            model_id=command.model_id,
            layer=Layer(
                layer_id=command.layer_id,
                name=command.name,
                description=command.description,
                type=command.type,
                properties=command.properties
            ),
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
