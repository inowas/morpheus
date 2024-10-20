import dataclasses
from typing import TypedDict

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelDiscretizationEvents import ModelTimeDiscretizationUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.discretization import TimeDiscretization


class StressPeriod(TypedDict):
    start_date_time: str
    number_of_time_steps: int
    time_step_multiplier: float
    steady_state: bool


class UpdateModelTimeDiscretizationCommandPayload(TypedDict):
    project_id: str
    start_date_time: str
    end_date_time: str
    stress_periods: list[StressPeriod]
    time_unit: str


@dataclasses.dataclass(frozen=True)
class UpdateModelTimeDiscretizationCommand(ProjectCommandBase):
    time_discretization: TimeDiscretization

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelTimeDiscretizationCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            time_discretization=TimeDiscretization.from_dict({
                'start_date_time': payload['start_date_time'],
                'end_date_time': payload['end_date_time'],
                'stress_periods': payload['stress_periods'],
                'time_unit': payload['time_unit']
            }),
        )


class UpdateModelTimeDiscretizationCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelTimeDiscretizationCommand):
        project_id = command.project_id
        user_id = command.user_id

        event = ModelTimeDiscretizationUpdatedEvent.from_time_discretization(project_id=project_id, time_discretization=command.time_discretization, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
