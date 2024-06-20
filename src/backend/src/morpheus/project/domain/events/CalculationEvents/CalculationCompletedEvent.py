from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId, CalculationLog
from morpheus.project.types.calculation.CalculationResult import CalculationResult

from .EventNames import CalculationEventName


class CalculationCompletedEvent(EventBase):
    @classmethod
    def from_log_and_result(cls, project_id: ProjectId, calculation_id: CalculationId, calculation_log: CalculationLog, result: CalculationResult, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'calculation_id': calculation_id.to_str(),
                'calculation_log': calculation_log.to_list(),
                'result': result.to_dict(),
            },
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_calculation_id(self) -> CalculationId:
        return CalculationId.from_str(self.payload['calculation_id'])

    def get_calculation_log(self) -> CalculationLog:
        return CalculationLog.from_list(self.payload['log'])

    def get_result(self) -> CalculationResult:
        return CalculationResult.from_dict(self.payload['result'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(CalculationEventName.CALCULATION_COMPLETED.to_str())
