from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId, CalculationLog

from .EventNames import CalculationEventName


class CalculationFailedEvent(EventBase):
    @classmethod
    def with_message(cls, project_id: ProjectId, calculation_id: CalculationId, message: str, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'calculation_id': calculation_id.to_str(),
                'error_message': message
            },
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_calculation_id(self) -> CalculationId:
        return CalculationId.from_str(self.payload['calculation_id'])

    def get_error_log(self) -> CalculationLog:
        return CalculationLog.from_str(self.payload['error_message'] if 'error_message' in self.payload else '')

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(CalculationEventName.CALCULATION_FAILED.to_str())
