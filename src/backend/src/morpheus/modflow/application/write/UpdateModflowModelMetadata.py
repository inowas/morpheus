import dataclasses

from ...infrastructure.persistence.ModflowModelRepository import ModflowModelRepository
from ...types.ModflowModel import ModelId
from ...types.Metadata import Metadata, Description, Name, Tags


@dataclasses.dataclass(frozen=True)
class UpdateModflowModelMetadataCommand:
    model_id: ModelId
    name: Name | None
    description: Description | None
    tags: Tags | None


@dataclasses.dataclass
class UpdateModflowModelMetadataCommandResult:
    pass


class UpdateModflowModelMetadataCommandHandler:
    @staticmethod
    def handle(command: UpdateModflowModelMetadataCommand):
        repository = ModflowModelRepository()
        model_id = command.model_id
        metadata = repository.get_modflow_model_metadata(model_id)
        if metadata is None:
            raise Exception(f'Could not find model with id {model_id.to_str()}')

        if command.name is not None:
            metadata = metadata.with_updated_name(command.name)

        if command.description is not None:
            metadata = metadata.with_updated_description(command.description)

        if command.tags is not None:
            metadata = metadata.with_updated_tags(command.tags)

        repository.update_modflow_model_metadata(model_id, metadata)

        return UpdateModflowModelMetadataCommandResult()
