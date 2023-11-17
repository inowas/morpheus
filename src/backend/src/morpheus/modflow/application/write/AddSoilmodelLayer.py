import dataclasses

from ...infrastructure.persistence.ProjectRepository import ProjectRepository
from morpheus.modflow.types.ModflowModel import ModelId
from ...types.soilmodel.Layer import LayerId, LayerName, LayerDescription, LayerType, LayerData, Layer


@dataclasses.dataclass(frozen=True)
class AddSoilmodelLayerCommand:
    model_id: ModelId
    name: LayerName
    description: LayerDescription
    type: LayerType
    data: LayerData


@dataclasses.dataclass(frozen=True)
class AddSoilmodelLayerCommandResult:
    layer_id: LayerId


class AddSoilmodelLayerCommandHandler:

    @staticmethod
    def handle(command: AddSoilmodelLayerCommand):
        modflow_model_repository = ProjectRepository()
        soilmodel = modflow_model_repository.get_modflow_model_soilmodel(command.model_id)

        if soilmodel is None:
            raise Exception(f'Could not find model with id {command.model_id.to_str()}')

        new_layer = Layer(
            id=LayerId.new(),
            name=command.name,
            description=command.description,
            type=command.type,
            data=command.data
        )

        soilmodel = soilmodel.with_added_layer(layer=new_layer)

        modflow_model_repository.update_modflow_model_soilmodel(command.model_id, soilmodel)

        return AddSoilmodelLayerCommandResult(layer_id=new_layer.id)
