from morpheus.common.types.event_sourcing.EventBase import EventBase
from ...infrastructure.persistence.ProjectEventRepository import project_event_repository, ProjectEventRepository
from ...types.Project import ProjectId


class ProjectEventLogReader:
    def __init__(self, _project_event_repository: ProjectEventRepository):
        self._project_event_repository = _project_event_repository

    def get_project_event_log(self, project_id: ProjectId) -> list[EventBase]:
        envelopes = self._project_event_repository.find_all_by_entity_uuid_ordered_by_version(project_id)
        return [envelope.get_event() for envelope in envelopes]


project_event_log_reader = ProjectEventLogReader(project_event_repository)
