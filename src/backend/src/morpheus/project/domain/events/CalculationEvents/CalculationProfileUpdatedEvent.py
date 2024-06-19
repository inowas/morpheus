from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.CalculationProfile import CalculationProfile

from .EventNames import CalculationEventName


class CalculationProfileUpdatedEvent(EventBase):
    @classmethod
    def from_calculation_profile(cls, project_id: ProjectId, calculation_profile: CalculationProfile, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'calculation_profile': calculation_profile.to_dict()
            },
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_calculation_profile(self) -> CalculationProfile:
        return CalculationProfile.from_dict(obj=self.payload['calculation_profile'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(CalculationEventName.CALCULATION_PROFILE_REMOVED.to_str())
