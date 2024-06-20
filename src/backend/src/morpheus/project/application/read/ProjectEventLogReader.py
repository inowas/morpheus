from morpheus.common.infrastructure.persistence.event_sourcing.EventRepository import EventRepository
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.identity.Identity import Identity
from .PermissionsReader import PermissionsReader, permissions_reader
from ...infrastructure.persistence.ProjectEventRepository import project_event_repository
from ...types.Project import ProjectId


class ProjectEventLogReader:
    def __init__(self, _project_event_repository: EventRepository, _permissions_reader: PermissionsReader):
        self._project_event_repository = _project_event_repository
        self._permissions_reader = _permissions_reader

    def get_project_event_log(self, project_id: ProjectId, identity: Identity) -> list[EventBase]:
        permissions = self._permissions_reader.get_permissions(project_id)

        # if permissions

        envelopes = self._project_event_repository.find_all_by_entity_uuid_ordered_by_version(project_id)
        return [envelope.get_event() for envelope in envelopes]


project_event_log_reader = ProjectEventLogReader(project_event_repository, permissions_reader)
