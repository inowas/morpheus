from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId, CheckModelLog

from .EventNames import CalculationEventName


class CalculationPreprocessedEvent(EventBase):
    @classmethod
    def from_log_and_result(cls, project_id: ProjectId, calculation_id: CalculationId, check_model_log: CheckModelLog, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'calculation_id': calculation_id.to_str(),
                'check_model_log': check_model_log.to_list(),
            },
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_calculation_id(self) -> CalculationId:
        return CalculationId.from_str(self.payload['calculation_id'])

    def get_check_model_log(self) -> CheckModelLog:
        return CheckModelLog.from_list(self.payload['check_model_log'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(CalculationEventName.CALCULATION_COMPLETED.to_str())
