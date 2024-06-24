import dataclasses
from typing import TypedDict

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ProjectEvents.ProjectEvents import ProjectCalculationProfileIdUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.calculation.CalculationProfile import CalculationProfileId


class UpdateProjectCalculationProfileIdCommandPayload(TypedDict):
    project_id: str
    calculation_profile_id: str


@dataclasses.dataclass(frozen=True)
class UpdateProjectCalculationProfileIdCommand(CommandBase):
    project_id: ProjectId
    calculation_profile_id: CalculationProfileId

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateProjectCalculationProfileIdCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            calculation_profile_id=CalculationProfileId.from_str(payload['calculation_profile_id']),
        )


class UpdateProjectCalculationProfileIdCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateProjectCalculationProfileIdCommand):
        project_id = command.project_id
        calculation_profile_id = command.calculation_profile_id
        user_id = command.user_id

        permissions = PermissionsReader().get_permissions(project_id=project_id)
        if not permissions.members.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update a calculation profile of the project {project_id.to_str()}')

        event = ProjectCalculationProfileIdUpdatedEvent.from_calculation_profile_id(project_id=project_id, calculation_profile_id=calculation_profile_id, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)
