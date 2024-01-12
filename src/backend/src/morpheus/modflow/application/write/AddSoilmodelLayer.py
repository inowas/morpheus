import dataclasses

from morpheus.modflow.types.ModflowModel import ModelId
from ...types.soil_model.Layer import LayerId, LayerName, LayerDescription, LayerType, LayerData


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
        raise Exception('Not implemented yet')

        # soilmodel = ... get soilmodel from repository
        #
        # if soilmodel is None:
        #     raise Exception(f'Could not find model with id {command.model_id.to_str()}')
        #
        # new_layer = Layer(
        #     id=LayerId.new(),
        #     name=command.name,
        #     description=command.description,
        #     type=command.type,
        #     data=command.data
        # )
        #
        # soilmodel = soilmodel.with_added_layer(layer=new_layer)
        #
        # ... persist soilmodel through repository
        #
        # return AddSoilmodelLayerCommandResult(layer_id=new_layer.id)
