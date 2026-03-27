from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.Exceptions import NotFoundException
from morpheus.project.application.read.PermissionsReader import permissions_reader
from morpheus.project.application.read.ProjectEventLogReader import project_event_log_reader
from morpheus.project.application.read.ProjectReader import project_reader
from morpheus.project.exceptions import InsufficientPermissionsException
from morpheus.project.incoming import get_identity
from morpheus.project.types.permissions.Privilege import Privilege
from morpheus.project.types.Project import ProjectId


class ReadProjectEventLogRequestHandler:
    @staticmethod
    def handle(project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            project_reader.assert_project_exists(project_id)
            permissions_reader.assert_identity_can(Privilege.EDIT_PROJECT, identity, project_id)
            event_log = project_event_log_reader.get_project_event_log(project_id)
            result = []
            for event in event_log:
                if isinstance(event, EventBase):
                    result.append(
                        {
                            'event_name': event.get_event_name().to_str(),
                            'occurred_at': event.occurred_at.to_str(),
                            'payload': event.payload,
                        }
                    )

            return result, 200
        except InsufficientPermissionsException as e:
            return str(e), 403
        except NotFoundException as e:
            return str(e), 404
