from ....application.read.ProjectsReader import ProjectsReader


class ReadProjectListRequestHandler:
    def handle(self):
        projects_reader = ProjectsReader()
        project_summaries = projects_reader.get_project_summaries()

        result = []
        for project_summary in project_summaries:
            result.append({
                'id': project_summary.project_id.to_str(),
                'name': project_summary.project_name,
                'description': project_summary.project_description,
                'tags': project_summary.project_tags,
                'ownerId': project_summary.owner_id.to_str(),
            })

        return result, 200
