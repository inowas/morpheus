from flask import Blueprint, request
from flask_cors import cross_origin

from ..incoming import authenticate
from ..presentation.api.read.models.ReadModelLayerPropertyDataRequestHandler import DataOutputFormat, ReadModelLayerPropertyDataRequestHandler
from ..presentation.api.read.models.ReadModelLayerPropertyImageRequestHandler import ImageOutputFormat, ReadModelLayerPropertyImageRequestHandler
from ..presentation.api.read.models.ReadModelLayersRequestHandler import ReadModelLayersRequestHandler
from ..types.layers.Layer import LayerId, LayerPropertyName
from ..types.Project import ProjectId


def register_routes(blueprint: Blueprint):
    """Register layer-related routes."""

    @blueprint.route('/<project_id>/model/layers', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_get_layers(project_id: str):
        return ReadModelLayersRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/model/layers/<layer_id>/properties/<property_name>', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_layer_property(project_id: str, layer_id: str, property_name: str):
        output_format = DataOutputFormat(request.args.get('format', DataOutputFormat.raster))
        return ReadModelLayerPropertyDataRequestHandler().handle(
            project_id=ProjectId.from_str(project_id), layer_id=LayerId.from_str(layer_id), property_name=LayerPropertyName.from_str(property_name), output_format=output_format
        )

    @blueprint.route('/<project_id>/model/layers/<layer_id>/properties/<property_name>/image', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_layer_property_image(project_id: str, layer_id: str, property_name: str):
        output_format = ImageOutputFormat(request.args.get('format', ImageOutputFormat.raster))
        return ReadModelLayerPropertyImageRequestHandler().handle(
            project_id=ProjectId.from_str(project_id), layer_id=LayerId.from_str(layer_id), property_name=LayerPropertyName.from_str(property_name), output_format=output_format
        )
