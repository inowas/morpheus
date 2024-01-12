import dataclasses

from ...infrastructure.persistence.ProjectRepository import ProjectRepository
from morpheus.modflow.types.ModflowModel import ModelId
from ...types.soilmodel.Layer import LayerId, LayerName, LayerDescription, LayerType, LayerData


@dataclasses.dataclass(frozen=True)
class UpdateSoilmodelLayerCommand:
    model_id: ModelId
    layer_id: LayerId
    name: LayerName
    description: LayerDescription
    type: LayerType
    data: LayerData


@dataclasses.dataclass(frozen=True)
class UpdateSoilmodelLayerCommandResult:
    layer_id: LayerId


class UpdateSoilmodelLayerCommandHandler:

    @staticmethod
    def handle(command: UpdateSoilmodelLayerCommand):
        raise Exception('Not implemented yet')

        # modflow_model_repository = ProjectRepository()
        # soilmodel = modflow_model_repository.get_modflow_model_soilmodel(command.model_id)
        #
        # if soilmodel is None:
        #     raise Exception(f'Could not find model with id {command.model_id.to_str()}')
        #
        # layer = soilmodel.get_layer(command.layer_id)
        # if layer is None:
        #     raise Exception(f'Could not find layer with id {command.layer_id.to_str()}')
        #
        # layer = layer.with_updated_name(command.name)
        # layer = layer.with_updated_description(command.description)
        # layer = layer.with_updated_type(command.type)
        # layer = layer.with_updated_data(command.data)
        #
        # soilmodel = soilmodel.with_updated_layer(layer)
        #
        # modflow_model_repository.update_modflow_model_soilmodel(command.model_id, soilmodel)
        # return UpdateSoilmodelLayerCommandResult(layer_id=layer.boundary_id)
