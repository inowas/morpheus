import dataclasses

from morpheus.common.types import Uuid
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.modflow.domain.events.ModflowEventName import ModflowEventName
from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.modflow.types.Project import ProjectId


@dataclasses.dataclass(frozen=True)
class BaseModelCreatedEvent(EventBase):
    @classmethod
    def from_base_model(cls, project_id: ProjectId, base_model: ModflowModel):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            payload=base_model.to_dict(),
        )

    def get_base_model(self) -> ModflowModel:
        return ModflowModel.from_dict(obj=self.payload)

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ModflowEventName.BASE_MODEL_CREATED.to_str())
