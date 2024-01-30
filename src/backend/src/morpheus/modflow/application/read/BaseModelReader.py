from ...infrastructure.persistence.BaseModelRepository import base_model_repository
from ...types.ModflowModel import ModflowModel
from ...types.Project import ProjectId


class BaseModelReader:
    def get_latest_base_model(self, project_id: ProjectId) -> ModflowModel:
        return base_model_repository.get_latest_base_model(project_id=project_id)
