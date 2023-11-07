import dataclasses
from ...infrastructure.persistence.ModflowModelRepository import ModflowModelRepository


@dataclasses.dataclass(frozen=True)
class ReadModflowModelListQuery:
    pass


@dataclasses.dataclass(frozen=True)
class ReadModflowModelListQueryResult:
    data: list[dict]

    def to_dict(self) -> list[dict]:
        return self.data


class ReadModflowModelListQueryHandler:
    @staticmethod
    def handle(query: ReadModflowModelListQuery) -> ReadModflowModelListQueryResult:
        models = ModflowModelRepository().get_modflow_models_metadata()
        if models is None:
            return ReadModflowModelListQueryResult([])

        models.sort(key=lambda x: x['metadata']['name'])
        return ReadModflowModelListQueryResult(models)
