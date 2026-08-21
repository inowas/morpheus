from typing import Literal

from fastapi import APIRouter, HTTPException, Query

from morpheus.fastapi_auth import IdentityDependency
from morpheus.project.presentation.api.read.models.ReadModelAffectedCellsRequestHandler import ReadModelAffectedCellsRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelBoundariesRequestHandler import ReadModelBoundariesRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelBoundaryAffectedCellsRequestHandler import ReadModelBoundaryAffectedCellsRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelCalculationDetailsRequestHandler import ReadModelCalculationDetailsRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelGridRequestHandler import ReadModelGridRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelLayerPropertyDataRequestHandler import ReadModelLayerPropertyDataRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelLayersRequestHandler import ReadModelLayersRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelObservationsRequestHandler import ReadModelHeadObservationsRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelRequestHandler import ReadModelRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelSpatialDiscretizationRequestHandler import ReadModelSpatialDiscretizationRequestHandler
from morpheus.project.presentation.api.read.models.ReadModelTimeDiscretizationRequestHandler import ReadModelTimeDiscretizationRequestHandler
from morpheus.project.types.boundaries.Boundary import BoundaryId
from morpheus.project.types.layers.Layer import LayerId, LayerPropertyName
from morpheus.project.types.observations.HeadObservation import ObservationId
from morpheus.project.types.Project import ProjectId

router = APIRouter(prefix='/projects', tags=['Models'])


def _result(result):
    if not isinstance(result, tuple):
        return result

    payload, status_code = result
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=payload or 'Request failed')
    return payload


@router.get('/{project_id}/model', operation_id='read_model')
def read_model(project_id: str, _: IdentityDependency):
    return _result(ReadModelRequestHandler().handle(ProjectId.from_str(project_id)))


@router.get('/{project_id}/model/calculation', operation_id='read_model_calculation')
def read_model_calculation(project_id: str, _: IdentityDependency):
    return _result(ReadModelCalculationDetailsRequestHandler().handle(ProjectId.from_str(project_id)))


@router.get('/{project_id}/model/spatial-discretization', operation_id='read_spatial_discretization')
def read_spatial_discretization(project_id: str, _: IdentityDependency):
    return _result(ReadModelSpatialDiscretizationRequestHandler().handle(ProjectId.from_str(project_id)))


@router.get('/{project_id}/model/spatial-discretization/affected-cells', operation_id='read_model_affected_cells')
def read_model_affected_cells(
    project_id: str,
    _: IdentityDependency,
    format: Literal['json', 'geojson', 'geojson_outline'] = Query('json'),
):
    return _result(ReadModelAffectedCellsRequestHandler().handle(ProjectId.from_str(project_id), format))


@router.get('/{project_id}/model/spatial-discretization/grid', operation_id='read_model_grid')
def read_model_grid(
    project_id: str,
    _: IdentityDependency,
    format: Literal['json', 'geojson'] = Query('json'),
):
    return _result(ReadModelGridRequestHandler().handle(ProjectId.from_str(project_id), format))


@router.get('/{project_id}/model/time-discretization', operation_id='read_time_discretization')
def read_time_discretization(project_id: str, _: IdentityDependency):
    return _result(ReadModelTimeDiscretizationRequestHandler().handle(ProjectId.from_str(project_id)))


@router.get('/{project_id}/model/layers', operation_id='read_model_layers')
def read_model_layers(project_id: str, _: IdentityDependency):
    return _result(ReadModelLayersRequestHandler().handle(ProjectId.from_str(project_id)))


@router.get('/{project_id}/model/layers/{layer_id}/properties/{property_name}', operation_id='read_model_layer_property')
def read_model_layer_property(
    project_id: str,
    layer_id: str,
    property_name: str,
    _: IdentityDependency,
    format: Literal['raster', 'grid', 'grid_original'] = Query('raster'),
):
    return _result(
        ReadModelLayerPropertyDataRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            layer_id=LayerId.from_str(layer_id),
            property_name=LayerPropertyName.from_str(property_name),
            output_format=format,
        )
    )


@router.get('/{project_id}/model/boundaries', operation_id='read_model_boundaries')
def read_model_boundaries(project_id: str, _: IdentityDependency):
    return _result(ReadModelBoundariesRequestHandler().handle(ProjectId.from_str(project_id)))


@router.get('/{project_id}/model/boundaries/{boundary_id}', operation_id='read_model_boundary')
def read_model_boundary(project_id: str, boundary_id: str, _: IdentityDependency):
    return _result(ReadModelBoundariesRequestHandler().handle(ProjectId.from_str(project_id), BoundaryId.from_str(boundary_id)))


@router.get('/{project_id}/model/boundaries/{boundary_id}/affected_cells', operation_id='read_model_boundary_affected_cells')
def read_model_boundary_affected_cells(
    project_id: str,
    boundary_id: str,
    _: IdentityDependency,
    format: Literal['json', 'geojson', 'geojson_outline'] = Query('json'),
):
    return _result(
        ReadModelBoundaryAffectedCellsRequestHandler().handle(
            project_id=ProjectId.from_str(project_id),
            boundary_id=BoundaryId.from_str(boundary_id),
            format=format,
        )
    )


@router.get('/{project_id}/model/head-observations', operation_id='read_head_observations')
def read_head_observations(project_id: str, _: IdentityDependency):
    return _result(ReadModelHeadObservationsRequestHandler().handle(ProjectId.from_str(project_id)))


@router.get('/{project_id}/model/head-observations/{head_observation_id}', operation_id='read_head_observation')
def read_head_observation(project_id: str, head_observation_id: str, _: IdentityDependency):
    return _result(
        ReadModelHeadObservationsRequestHandler().handle(
            ProjectId.from_str(project_id), ObservationId.from_str(head_observation_id)
        )
    )
