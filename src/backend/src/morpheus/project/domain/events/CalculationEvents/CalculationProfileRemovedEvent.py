from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.CalculationProfile import CalculationProfileId

from .EventNames import CalculationEventName


class CalculationProfileRemovedEvent(EventBase):
    @classmethod
    def from_calculation_profile(cls, project_id: ProjectId, calculation_profile_id: CalculationProfileId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'calculation_profile_id': calculation_profile_id.to_str()
            },
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_calculation_profile_id(self) -> CalculationProfileId:
        return CalculationProfileId.from_str(self.payload['calculation_profile_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(CalculationEventName.CALCULATION_PROFILE_DELETED.to_str())
