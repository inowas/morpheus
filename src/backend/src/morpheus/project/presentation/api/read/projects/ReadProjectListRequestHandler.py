from morpheus.project.application.read.ProjectReader import project_reader
from morpheus.project.incoming import get_identity


class ReadProjectListRequestHandler:
    @staticmethod
    def handle():
        identity = get_identity()
        if identity is None:
            return '', 401

        project_summaries_with_privileges = project_reader.get_project_summaries_with_user_privileges_for_identity(identity)

        result = []
        for project_summary, privileges in project_summaries_with_privileges:
            result.append(
                {
                    'project_id': project_summary.project_id.to_str(),
                    'name': project_summary.project_name.to_str(),
                    'description': project_summary.project_description.to_str(),
                    'tags': project_summary.project_tags.to_list(),
                    'owner_id': project_summary.owner_id.to_str(),
                    'is_public': project_summary.visibility == project_summary.visibility.PUBLIC,
                    'created_at': project_summary.created_at.to_str(),
                    'updated_at': project_summary.updated_at.to_str(),
                    'user_privileges': [privilege.value for privilege in privileges],
                }
            )

        return result, 200
