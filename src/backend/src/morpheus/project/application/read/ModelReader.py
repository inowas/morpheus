from ...infrastructure.persistence.ModelRepository import model_repository
from ...infrastructure.persistence.ModelVersionTagRepository import model_version_tag_repository
from ...types.ModelVersion import ModelVersion, VersionTag
from ...types.Model import Model
from ...types.Project import ProjectId


class ModelReader:
    def get_latest_model(self, project_id: ProjectId) -> Model:
        return model_repository.get_latest_model(project_id=project_id)

    def get_versions(self, project_id: ProjectId) -> list[ModelVersion]:
        return model_version_tag_repository.get_all_versions(project_id=project_id)

    def get_version_by_tag(self, project_id: ProjectId, tag: VersionTag) -> ModelVersion:
        return model_version_tag_repository.get_version_by_tag(project_id=project_id, tag=tag)


def get_model_reader() -> ModelReader:
    return ModelReader()
