from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.project.application.read.ProjectReader import project_reader
from morpheus.project.application.read.ProjectEventLogReader import project_event_log_reader
from morpheus.project.types.Project import ProjectId


class ReadProjectListRequestHandler:
    @staticmethod
    def handle():
        project_summaries = project_reader.get_project_summaries()

        result = []
        for project_summary in project_summaries:
            result.append({
                'project_id': project_summary.project_id.to_str(),
                'name': project_summary.project_name.to_str(),
                'description': project_summary.project_description.to_str(),
                'tags': project_summary.project_tags.to_list(),
                'owner_id': project_summary.owner_id.to_str(),
                'is_public': True if project_summary.visibility == project_summary.visibility.PUBLIC else False,
                'created_at': project_summary.created_at.to_str(),
                'updated_at': project_summary.updated_at.to_str(),
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
