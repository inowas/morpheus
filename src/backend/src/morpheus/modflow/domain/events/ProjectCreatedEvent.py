import dataclasses

from morpheus.common.types import Uuid
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.common.types.event_sourcing.EventPayloadBase import EventPayloadBase
from morpheus.modflow.domain.events.ModflowEventName import ModflowEventName
from morpheus.modflow.types.Project import Project, ProjectId
from morpheus.modflow.types.Settings import Name


@dataclasses.dataclass(frozen=True)
class ProjectCreatedEventPayload(EventPayloadBase):
    project_id: ProjectId
    project_name: Name

    @classmethod
    def from_dict(cls, obj: dict):
        if 'project_id' not in obj or obj['project_id'] is None:
            raise ValueError('project_id is missing')
        if 'project_name' not in obj or obj['project_name'] is None:
            raise ValueError('project_name is missing')

        return cls(
            project_id=ProjectId.from_str(obj['project_id']),
            project_name=Name.from_str(obj['project_name']),
        )

    def to_dict(self) -> dict:
        return {
            'project_id': self.project_id.to_str(),
            'project_name': self.project_name.to_str(),
        }


@dataclasses.dataclass(frozen=True)
class ProjectCreatedEvent(EventBase):
    payload: ProjectCreatedEventPayload

    @classmethod
    def from_project(cls, project: Project):
        return cls.from_payload(
            payload=ProjectCreatedEventPayload(
                project_id=project.project_id,
                project_name=project.settings.metadata.name,
            ),
        )

    @classmethod
    def from_payload(cls, payload: ProjectCreatedEventPayload):
        return cls(
            payload=payload,
        )

    def get_payload(self) -> ProjectCreatedEventPayload:
        return self.payload

    def get_event_name(self) -> EventName:
        return EventName.from_str(ModflowEventName.PROJECT_CREATED.to_str())

    def get_event_entity_uuid(self) -> Uuid:
        return self.payload.project_id

