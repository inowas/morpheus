from typing import Annotated, Literal

from fastapi import APIRouter, HTTPException, Query

from morpheus.fastapi_auth import IdentityDependency
from morpheus.fastapi_contract import NOT_FOUND_RESPONSES
from morpheus.project.presentation.api.read.calculations.ReadCalculationBudgetResultsRequestHandler import ReadCalculationBudgetResultsRequestHandler
from morpheus.project.presentation.api.read.calculations.ReadCalculationDetailsRequestHandler import ReadCalculationDetailsRequestHandler
from morpheus.project.presentation.api.read.calculations.ReadCalculationFileRequestHandler import ReadCalculationFileRequestHandler
from morpheus.project.presentation.api.read.calculations.ReadCalculationLayerResultsRequestHandler import ReadCalculationLayerResultsRequestHandler
from morpheus.project.presentation.api.read.calculations.ReadCalculationObservationResultsRequestHandler import ReadCalculationObservationResultsRequestHandler
from morpheus.project.presentation.api.read.calculations.ReadCalculationsRequestHandler import ReadCalculationsRequestHandler
from morpheus.project.presentation.api.read.calculations.ReadCalculationTimeSeriesResultsRequestHandler import ReadCalculationTimeSeriesResultsRequestHandler
from morpheus.project.types.calculation.Calculation import CalculationId
from morpheus.project.types.Project import ProjectId

router = APIRouter(prefix='/projects', tags=['Calculations'], responses=NOT_FOUND_RESPONSES)


def _result(result):
    if not isinstance(result, tuple):
        return result

    payload, status_code = result
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=payload or 'Request failed')
    return payload


@router.get('/{project_id}/calculations', operation_id='readCalculations')
def read_calculations(project_id: str, _: IdentityDependency):
    return _result(ReadCalculationsRequestHandler().handle(ProjectId.from_str(project_id)))


@router.get('/{project_id}/calculations/{calculation_id}', operation_id='readCalculationDetails')
def read_calculation_details(project_id: str, calculation_id: str, _: IdentityDependency):
    return _result(ReadCalculationDetailsRequestHandler().handle(ProjectId.from_str(project_id), CalculationId.from_str(calculation_id)))


@router.get('/{project_id}/calculations/{calculation_id}/files/{file_name}', operation_id='readCalculationFile')
def read_calculation_file(project_id: str, calculation_id: str, file_name: str, _: IdentityDependency):
    return _result(
        ReadCalculationFileRequestHandler().handle(project_id=ProjectId.from_str(project_id), calculation_id=CalculationId.from_str(calculation_id), file_name=file_name)
    )


@router.get('/{project_id}/calculations/{calculation_id}/results/budget/{result_type}', operation_id='readCalculationBudgetResults')
def read_calculation_budget_results(
    project_id: str,
    calculation_id: str,
    result_type: Literal['flow', 'transport'],
    _: IdentityDependency,
    time_idx: Annotated[int, Query()] = 0,
    incremental: Annotated[bool, Query()] = False,
):
    return _result(
        ReadCalculationBudgetResultsRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            calculation_id=CalculationId.from_str(calculation_id),
            result_type=result_type,
            time_idx=time_idx,
            incremental=incremental,
        )
    )


@router.get('/{project_id}/calculations/{calculation_id}/results/layer/{result_type}', operation_id='readCalculationLayerResults')
def read_calculation_layer_results(
    project_id: str,
    calculation_id: str,
    result_type: Literal['head', 'drawdown', 'concentration'],
    _: IdentityDependency,
    time_idx: Annotated[int, Query()] = 0,
    layer: Annotated[int, Query()] = 0,
):
    return _result(
        ReadCalculationLayerResultsRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            calculation_id=CalculationId.from_str(calculation_id),
            result_type=result_type,
            time_idx=time_idx,
            layer=layer,
        )
    )


@router.get('/{project_id}/calculations/{calculation_id}/results/observation/{result_type}', operation_id='readCalculationObservationResults')
def read_calculation_observation_results(
    project_id: str,
    calculation_id: str,
    result_type: Literal['head'],
    _: IdentityDependency,
):
    return _result(
        ReadCalculationObservationResultsRequestHandler().handle(
            project_id=ProjectId.from_str(project_id), calculation_id=CalculationId.from_str(calculation_id), result_type=result_type
        )
    )


@router.get('/{project_id}/calculations/{calculation_id}/results/time_series/{result_type}', operation_id='readCalculationTimeSeriesResults')
def read_calculation_time_series_results(
    project_id: str,
    calculation_id: str,
    result_type: Literal['head', 'drawdown', 'concentration'],
    _: IdentityDependency,
    layer: Annotated[int, Query()] = 0,
    row: Annotated[int, Query()] = 0,
    col: Annotated[int, Query()] = 0,
):
    return _result(
        ReadCalculationTimeSeriesResultsRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            calculation_id=CalculationId.from_str(calculation_id),
            result_type=result_type,
            layer=layer,
            row=row,
            col=col,
        )
    )
