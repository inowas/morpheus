from ...infrastructure.persistence.AssetRepository import asset_repository, AssetRepository
from ...infrastructure.persistence.PreviewImageRepository import preview_image_repository, PreviewImageRepository
from ...infrastructure.persistence.ProjectSummaryRepository import project_summary_repository, ProjectSummaryRepository
from ...types.Asset import Asset
from ...types.Project import ProjectSummary, ProjectId


class ProjectsReader:
    def __init__(
        self,
        project_summary_repository: ProjectSummaryRepository,
        preview_image_repository: PreviewImageRepository,
        asset_repository: AssetRepository,
    ):
        self._project_summary_repository = project_summary_repository
        self._preview_image_repository = preview_image_repository
        self._asset_repository = asset_repository

    def project_exists(self, project_id: ProjectId) -> bool:
        return self._project_summary_repository.exists(project_id)

    def get_project_summaries(self) -> list[ProjectSummary]:
        return self._project_summary_repository.find_all()

    def get_preview_image(self, project_id: ProjectId) -> Asset | None:
        asset_id = self._preview_image_repository.get_preview_image(project_id)
        if asset_id is None:
            return None

        return self._asset_repository.get_asset(asset_id)


projects_reader = ProjectsReader(
    project_summary_repository=project_summary_repository,
    preview_image_repository=preview_image_repository,
    asset_repository=asset_repository,
)
