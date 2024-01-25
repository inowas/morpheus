import dataclasses

from morpheus.modflow.types.ModflowModel import ModelId
from ...types.soil_model.Layer import LayerId, LayerName, LayerDescription, LayerType, LayerData


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


@dataclasses.dataclass(frozen=True)
class AddSoilmodelLayerCommand:
    model_id: ModelId
    name: LayerName
    description: LayerDescription
    type: LayerType
    data: LayerData


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


class UpdateSoilmodelLayerCommandHandler:

    @staticmethod
    def handle(command: UpdateSoilmodelLayerCommand):
        raise Exception('Not implemented yet')

        # soilmodel = ... get soilmodel from repository
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
        # ... persist soilmodel through repository
        # return UpdateSoilmodelLayerCommandResult(layer_id=layer.boundary_id)
