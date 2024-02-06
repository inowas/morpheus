from ...infrastructure.persistence.BaseModelRepository import base_model_repository
from ...infrastructure.persistence.BaseModelVersionTagRepository import base_model_version_tag_repository
from ...types.BaseModelVersion import BaseModelVersion, VersionTag
from ...types.ModflowModel import ModflowModel
from ...types.Project import ProjectId


class BaseModelReader:
    def get_latest_base_model(self, project_id: ProjectId) -> ModflowModel:
        return base_model_repository.get_latest_base_model(project_id=project_id)

    def get_versions(self, project_id: ProjectId) -> list[BaseModelVersion]:
        return base_model_version_tag_repository.get_all_versions(project_id=project_id)

    def get_version_by_tag(self, project_id: ProjectId, tag: VersionTag) -> BaseModelVersion:
        return base_model_version_tag_repository.get_version_by_tag(project_id=project_id, tag=tag)
