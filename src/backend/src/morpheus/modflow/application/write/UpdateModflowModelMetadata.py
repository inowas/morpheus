import dataclasses

from ...infrastructure.persistence.ModflowModelRepository import ModflowModelRepository
from ...types.ModflowModel import ModelId
from ...types.Metadata import Metadata, Description, Name, Tags


@dataclasses.dataclass(frozen=True)
class UpdateModflowModelMetadataCommand:
    id: ModelId
    name: Name
    description: Description
    tags: Tags


@dataclasses.dataclass
class UpdateModflowModelMetadataCommandResult:
    pass


class UpdateModflowModelMetadataCommandHandler:
    @staticmethod
    def handle(command: UpdateModflowModelMetadataCommand):
        repository = ModflowModelRepository()
        metadata = repository.get_modflow_model_metadata(command.id.to_str())
        if metadata is None:
            raise Exception(f'Could not find model with id {command.id.to_str()}')

        metadata = Metadata(
            name=command.name,
            description=command.description,
            tags=command.tags,
        )

        repository.update_modflow_model_metadata(command.id.to_str(), metadata)

        return UpdateModflowModelMetadataCommandResult()
