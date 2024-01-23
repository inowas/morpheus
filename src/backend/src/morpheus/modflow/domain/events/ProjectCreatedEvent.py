import dataclasses

from morpheus.common.types import Uuid
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.modflow.domain.events.ModflowEventName import ModflowEventName
from morpheus.modflow.types.Project import Project, ProjectId


@dataclasses.dataclass(frozen=True)
class ProjectCreatedEvent(EventBase):
    @classmethod
    def from_project(cls, project: Project):
        return cls(
            entity_uuid=Uuid.from_str(project.project_id.to_str()),
            payload=project.to_dict(),
        )

    def get_project(self) -> Project:
        return Project.from_dict(obj=self.payload)

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ModflowEventName.PROJECT_CREATED.to_str())
