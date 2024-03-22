from morpheus.project.application.read.ProjectsReader import projects_reader
from morpheus.project.presentation.api.helpers.asset import asset_file_response, default_preview_image_response
from morpheus.project.types.Project import ProjectId


class ReadProjectListRequestHandler:
    @staticmethod
    def handle():
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


class ReadPreviewImageRequestHandler:
    @staticmethod
    def handle(project_id: str):
        # user_id = get_logged_in_user_id()
        # if user_id is None:
        #     abort(401, 'Unauthorized')

        if not projects_reader.project_exists(ProjectId.from_str(project_id)):
            return '', 404

        preview_image_asset = projects_reader.get_preview_image(ProjectId.from_str(project_id))
        if preview_image_asset is None:
            return default_preview_image_response()

        return asset_file_response(preview_image_asset)
