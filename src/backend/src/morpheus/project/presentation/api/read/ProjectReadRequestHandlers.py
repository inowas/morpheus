from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.project.application.read.ProjectReader import project_reader
from morpheus.project.application.read.ProjectEventLogReader import project_event_log_reader
from morpheus.project.incoming import get_identity
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId


class ReadProjectListRequestHandler:
    @staticmethod
    def handle():
        identity = get_identity()

        if identity is None:
            return '', 401

        project_summaries_with_user_role = project_reader.get_project_summaries_with_role_for_identity(identity)

        result = []
        for (project_summary, user_role) in project_summaries_with_user_role:
            result.append({
                'project_id': project_summary.project_id.to_str(),
                'name': project_summary.project_name.to_str(),
                'description': project_summary.project_description.to_str(),
                'tags': project_summary.project_tags.to_list(),
                'owner_id': project_summary.owner_id.to_str(),
                'is_public': True if project_summary.visibility == project_summary.visibility.PUBLIC else False,
                'created_at': project_summary.created_at.to_str(),
                'updated_at': project_summary.updated_at.to_str(),
                'user_role': user_role.to_str() if user_role is not None else None,
            })

        return result, 200


class ReadProjectEventLogRequestHandler:
    @staticmethod
    def handle(project_id: ProjectId):
        event_log = project_event_log_reader.get_project_event_log(project_id)
        result = []
        for event in event_log:
            if isinstance(event, EventBase):
                result.append({
                    'event_name': event.get_event_name().to_str(),
                    'occurred_at': event.occurred_at.to_str(),
                    'payload': event.payload,
                })

        return result, 200
