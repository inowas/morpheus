from typing import Literal

from flask import Blueprint, request
from flask_cors import CORS, cross_origin

from .incoming import authenticate
from .presentation.api.read.ReadCalculationDetailsRequestHandler import ReadCalculationDetailsRequestHandler
from .presentation.api.read.ReadCalculationFileRequestHandler import ReadCalculationFileRequestHandler
from .presentation.api.read.ReadCalculationResultsRequestHandler import ReadCalculationResultsRequestHandler
from .presentation.api.read.ReadCalculationProfilesRequestHandler import ReadCalculationProfilesRequestHandler
from .presentation.api.read.ReadCalculationsRequestHandler import ReadCalculationsRequestHandler
from .presentation.api.read.ReadModelAffectedCellsRequestHandler import ReadModelAffectedCellsRequestHandler
from .presentation.api.read.ReadModelBoundariesRequestHandler import ReadModelBoundariesRequestHandler
from .presentation.api.read.ReadModelBoundaryAffectedCellsRequestHandler import ReadModelBoundaryAffectedCellsRequestHandler
from .presentation.api.read.ReadModelCalculationDetailsRequestHandler import ReadModelCalculationDetailsRequestHandler
from .presentation.api.read.ReadModelGridRequestHandler import ReadModelGridRequestHandler
from .presentation.api.read.ReadModelLayerPropertyImageRequestHandler import ReadModelLayerPropertyImageRequestHandler, ImageOutputFormat
from .presentation.api.read.ReadModelLayerPropertyDataRequestHandler import ReadModelLayerPropertyDataRequestHandler, DataOutputFormat
from .presentation.api.read.ReadModelLayersRequestHandler import ReadModelLayersRequestHandler
from .presentation.api.read.ReadModelRequestHandler import ReadModelRequestHandler
from .presentation.api.read.ReadModelSpatialDiscretizationRequestHandler import ReadModelSpatialDiscretizationRequestHandler
from .presentation.api.read.ReadModelTimeDiscretizationRequestHandler import ReadModelTimeDiscretizationRequestHandler
from .presentation.api.read.ReadPrivilegesRequestHandler import ReadPrivilegesRequestHandler
from .presentation.api.read.ReadSelectedCalculationProfileRequestHandler import ReadSelectedCalculationProfileRequestHandler
from .presentation.api.write.MessageBoxRequestHandler import MessageBoxRequestHandler
from .types.Asset import AssetId
from .types.Project import ProjectId
from .presentation.api.read.AssetReadRequestHandlers import ReadPreviewImageRequestHandler, ReadAssetListRequestHandler, DownloadAssetRequestHandler, ReadAssetRequestHandler, \
    ReadAssetDataRequestHandler
from .presentation.api.read.ProjectReadRequestHandlers import ReadProjectListRequestHandler, ReadProjectEventLogRequestHandler
from .presentation.api.write.AssetWriteRequestHandlers import UploadPreviewImageRequestHandler, DeletePreviewImageRequestHandler, UploadAssetRequestHandler
from .types.boundaries.Boundary import BoundaryId
from .types.calculation.Calculation import CalculationId
from .types.calculation.CalculationProfile import CalculationProfileId
from .types.layers.Layer import LayerPropertyName, LayerId
from ..common.presentation.api.middleware.schema_validation import validate_request


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)

    # Write routes

    @blueprint.route('/messagebox', methods=['POST'])
    @cross_origin(expose_headers='Location')
    @authenticate()
    @validate_request
    def create_project():
        return MessageBoxRequestHandler().handle(request=request)

    @blueprint.route('/<project_id>/assets', methods=['POST'])
    @cross_origin(expose_headers='Location')
    @authenticate()
    @validate_request
    def upload_project_asset(project_id: str):
        return UploadAssetRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/model/calculation', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_latest_model_calculation_details(project_id: str):
        return ReadModelCalculationDetailsRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/calculations', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_calculations(project_id: str):
        return ReadCalculationsRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/calculations/<calculation_id>', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_calculation_details(project_id: str, calculation_id: str):
        return ReadCalculationDetailsRequestHandler().handle(project_id=ProjectId.from_str(project_id), calculation_id=CalculationId.from_str(calculation_id))

    @blueprint.route('/<project_id>/calculations/<calculation_id>/files/<file_name>', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_calculation_read_file(project_id: str, calculation_id: str, file_name: str):
        return ReadCalculationFileRequestHandler().handle(project_id=ProjectId.from_str(project_id), calculation_id=CalculationId.from_str(calculation_id), file_name=file_name)

    @blueprint.route('/<project_id>/calculations/<calculation_id>/results/<result_type>', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_calculation_results(project_id: str, calculation_id: str, result_type: str = 'flow_head'):
        idx = int(request.args.get('idx', 0))
        layer = int(request.args.get('layer', 0))
        incremental = request.args.get('incremental', 'false').lower() == 'true'
        return ReadCalculationResultsRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            calculation_id=CalculationId.from_str(calculation_id),
            result_type=result_type,
            idx=idx,
            layer=layer,
            incremental=incremental
        )

    @blueprint.route('/<project_id>/model/calculation-profile', methods=['GET'])
    @blueprint.route('/<project_id>/calculation-profiles/selected', methods=['GET'])
    @blueprint.route('/<project_id>/calculation-profiles/<calculation_profile_id>', methods=['GET'])
    @cross_origin()
    @authenticate()
    @validate_request
    def project_selected_calculation_profile(project_id: str, calculation_profile_id: str | None = None):
        return ReadSelectedCalculationProfileRequestHandler().handle(project_id=ProjectId.from_str(project_id), calculation_profile_id=CalculationProfileId.try_from_str(calculation_profile_id))

    @blueprint.route('/<project_id>/calculation-profiles', methods=['GET'])
    @cross_origin()
    @authenticate()
    @validate_request
    def get_project_calculation_profiles(project_id: str):
        return ReadCalculationProfilesRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/preview_image', methods=['PUT'])
    @cross_origin()
    @authenticate()
    @validate_request
    def project_preview_image_upload(project_id: str):
        return UploadPreviewImageRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    # Read routes
    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    @authenticate()
    def list_projects():
        return ReadProjectListRequestHandler().handle()

    @blueprint.route('/<project_id>/event-log', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_event_log(project_id: str):
        return ReadProjectEventLogRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/model', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_get_model(project_id: str):
        return ReadModelRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/model/spatial-discretization', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_get_spatial_discretization(project_id: str):
        return ReadModelSpatialDiscretizationRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/model/spatial-discretization/affected-cells', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_spatial_discretization_get_affected_cells(project_id: str):
        output_format: Literal['json', 'geojson', 'geojson_outline'] | str = request.args.get('format', 'json')  # default to json
        return ReadModelAffectedCellsRequestHandler().handle(project_id=ProjectId.from_str(project_id), format=output_format)

    @blueprint.route('/<project_id>/model/spatial-discretization/grid', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_spatial_discretization_get_grid(project_id: str):
        output_format = request.args.get('format', 'json')
        if output_format not in ['json', 'geojson']:
            output_format = 'json'
        return ReadModelGridRequestHandler().handle(project_id=ProjectId.from_str(project_id), format=output_format)

    @blueprint.route('/<project_id>/model/time-discretization', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_time_discretization(project_id: str):
        return ReadModelTimeDiscretizationRequestHandler().handle(project_id=ProjectId.from_str(project_id))

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
            project_id=ProjectId.from_str(project_id),
            layer_id=LayerId.from_str(layer_id),
            property_name=LayerPropertyName.from_str(property_name),
            output_format=output_format
        )

    @blueprint.route('/<project_id>/model/layers/<layer_id>/properties/<property_name>/image', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_layer_property_image(project_id: str, layer_id: str, property_name: str):
        output_format = ImageOutputFormat(request.args.get('format', ImageOutputFormat.raster))
        return ReadModelLayerPropertyImageRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            layer_id=LayerId.from_str(layer_id),
            property_name=LayerPropertyName.from_str(property_name),
            output_format=output_format
        )

    @blueprint.route('/<project_id>/model/boundaries', methods=['GET'])
    @blueprint.route('/<project_id>/model/boundaries/<boundary_id>', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_boundaries(project_id: str, boundary_id: str | None = None):
        return ReadModelBoundariesRequestHandler().handle(project_id=ProjectId.from_str(project_id), boundary_id=BoundaryId.try_from_str(boundary_id))

    @blueprint.route('/<project_id>/model/boundaries/<boundary_id>/affected_cells', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_boundary_affected_cells(project_id: str, boundary_id: str):
        output_format: Literal['json', 'geojson', 'geojson_outline'] | str = request.args.get('format', 'json')  # default to json
        return ReadModelBoundaryAffectedCellsRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            boundary_id=BoundaryId.from_str(boundary_id),
            format=output_format
        )

    @blueprint.route('/<project_id>/privileges', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_privileges(project_id: str):
        return ReadPrivilegesRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/preview_image', methods=['GET'])
    @cross_origin()
    # for now without authentication (see https://redmine.junghanns.it/issues/2388)
    # @authenticate()
    @validate_request
    def project_preview_image_fetch(project_id: str):
        return ReadPreviewImageRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/preview_image', methods=['DELETE'])
    @cross_origin()
    @authenticate()
    @validate_request
    def project_preview_image_deletion(project_id: str):
        return DeletePreviewImageRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/assets', methods=['GET'])
    @cross_origin()
    @authenticate()
    @validate_request
    def project_assets(project_id: str):
        return ReadAssetListRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/assets/<asset_id>', methods=['GET'])
    @cross_origin()
    @authenticate()
    @validate_request
    def project_asset(project_id: str, asset_id: str):
        return ReadAssetRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            asset_id=AssetId.from_str(asset_id)
        )

    @blueprint.route('/<project_id>/assets/<asset_id>/file', methods=['GET'])
    @cross_origin()
    @authenticate()
    @validate_request
    def download_project_asset(project_id: str, asset_id: str):
        return DownloadAssetRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            asset_id=AssetId.from_str(asset_id)
        )

    @blueprint.route('/<project_id>/assets/<asset_id>/data', methods=['GET'])
    @cross_origin()
    @authenticate()
    @validate_request
    def project_asset_data(project_id: str, asset_id: str):
        band = request.args.get('band', None)
        return ReadAssetDataRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            asset_id=AssetId.from_str(asset_id),
            band=int(band) if band is not None else None
        )
