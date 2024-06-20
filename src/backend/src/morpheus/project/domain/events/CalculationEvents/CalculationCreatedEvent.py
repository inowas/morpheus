from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.project.types.Model import Model, ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId
from morpheus.project.types.calculation.CalculationProfile import CalculationProfile

from .EventNames import CalculationEventName


class CalculationCreatedEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, calculation_id: CalculationId, model: Model, model_version: str, profile: CalculationProfile, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'project_id': project_id.to_str(),
                'calculation_id': calculation_id.to_str(),
                'model_id': model.model_id.to_str(),
                'model_hash': model.get_sha1_hash(),
                'model_version': model_version,
                'profile': profile.to_dict(),
            },
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_calculation_id(self) -> CalculationId:
        return CalculationId.from_str(self.payload['calculation_id'])

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_model_hash(self) -> str:
        return self.payload['model_hash']

    def get_model_version(self) -> str:
        return self.payload['model_version']

    def get_profile(self) -> CalculationProfile:
        return CalculationProfile.from_dict(self.payload['profile'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(CalculationEventName.CALCULATION_CREATED.to_str())
