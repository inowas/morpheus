from flask import Blueprint, request
from flask_cors import cross_origin

from ..incoming import authenticate
from ..presentation.api.read.calculations.ReadCalculationBudgetResultsRequestHandler import ReadCalculationBudgetResultsRequestHandler
from ..presentation.api.read.calculations.ReadCalculationDetailsRequestHandler import ReadCalculationDetailsRequestHandler
from ..presentation.api.read.calculations.ReadCalculationFileRequestHandler import ReadCalculationFileRequestHandler
from ..presentation.api.read.calculations.ReadCalculationLayerResultsRequestHandler import ReadCalculationLayerResultsRequestHandler
from ..presentation.api.read.calculations.ReadCalculationObservationResultsRequestHandler import ReadCalculationObservationResultsRequestHandler
from ..presentation.api.read.calculations.ReadCalculationsRequestHandler import ReadCalculationsRequestHandler
from ..presentation.api.read.calculations.ReadCalculationTimeSeriesResultsRequestHandler import ReadCalculationTimeSeriesResultsRequestHandler
from ..types.calculation.Calculation import CalculationId
from ..types.Project import ProjectId


def register_routes(blueprint: Blueprint):
    """Register calculation-related routes."""

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

    @blueprint.route('/<project_id>/calculations/<calculation_id>/results/budget/<result_type>', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_calculation_budget_results(project_id: str, calculation_id: str, result_type: str = 'flow'):
        # types are flow, transport
        time_idx = int(request.args.get('time_idx', 0))
        incremental = request.args.get('incremental', 'false').lower() == 'true'
        return ReadCalculationBudgetResultsRequestHandler().handle(
            project_id=ProjectId.from_str(project_id), calculation_id=CalculationId.from_str(calculation_id), result_type=result_type, time_idx=time_idx, incremental=incremental
        )

    @blueprint.route('/<project_id>/calculations/<calculation_id>/results/layer/<result_type>', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_calculation_layer_results(project_id: str, calculation_id: str, result_type: str = 'head'):
        # types are head, drawdown, concentration
        time_idx = int(request.args.get('time_idx', 0))
        layer = int(request.args.get('layer', 0))
        return ReadCalculationLayerResultsRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            calculation_id=CalculationId.from_str(calculation_id),
            result_type=result_type,
            time_idx=time_idx,
            layer=layer,
        )

    @blueprint.route('/<project_id>/calculations/<calculation_id>/results/observation/<result_type>', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_calculation_observation_results(project_id: str, calculation_id: str, result_type: str = 'head'):
        # types are head
        return ReadCalculationObservationResultsRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            calculation_id=CalculationId.from_str(calculation_id),
            result_type=result_type,
        )

    @blueprint.route('/<project_id>/calculations/<calculation_id>/results/time_series/<result_type>', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_calculation_time_series_results(project_id: str, calculation_id: str, result_type: str = 'head'):
        # types are head, drawdown, concentration
        layer = int(request.args.get('layer', 0))
        row = int(request.args.get('row', 0))
        col = int(request.args.get('col', 0))
        return ReadCalculationTimeSeriesResultsRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            calculation_id=CalculationId.from_str(calculation_id),
            result_type=result_type,
            layer=layer,
            row=row,
            col=col,
        )
