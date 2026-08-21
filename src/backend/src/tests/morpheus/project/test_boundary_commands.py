import pytest

from morpheus.project.application.write.Model.Boundaries import (
    CloneModelBoundaryCommand,
    DisableModelBoundaryCommand,
    EnableModelBoundaryCommand,
    RemoveModelBoundariesCommand,
    UpdateModelBoundaryAffectedCellsCommand,
    UpdateModelBoundaryAffectedLayersCommand,
    UpdateModelBoundaryGeometryCommand,
    UpdateModelBoundaryInterpolationCommand,
    UpdateModelBoundaryMetadataCommand,
    UpdateModelBoundaryTagsCommand,
)
from morpheus.project.types.boundaries.Boundary import BoundaryId, BoundaryName, BoundaryTags, BoundaryType
from morpheus.project.types.boundaries.BoundaryInterpolationType import InterpolationType
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.discretization.spatial.ActiveCells import ActiveCell
from morpheus.project.types.geometry import LineString, Point

pytestmark = [pytest.mark.integration, pytest.mark.boundary]


def get_boundary(context):
    model = context['model_reader'].get_latest_model(context['project_id'])
    boundary = model.boundaries.get_boundary(context['boundary_id'])
    assert boundary is not None
    return boundary


def test_add_boundary_persists_default_boundary(boundary_context):
    boundary = get_boundary(boundary_context)

    assert boundary.type == BoundaryType.well
    assert boundary.name.to_str() == 'new well boundary'
    assert boundary.geometry.type == 'Point'
    assert list(boundary.geometry.coordinates) == [13.9235, 50.9655]
    assert boundary.enabled is True
    assert len(boundary.observations) == 1


def test_update_boundary_metadata_and_tags(boundary_context, command_bus):
    context = boundary_context

    command_bus.dispatch(
        UpdateModelBoundaryMetadataCommand(
            project_id=context['project_id'],
            model_id=context['model_id'],
            boundary_id=context['boundary_id'],
            boundary_name=BoundaryName('Updated Well'),
            boundary_tags=None,
            user_id=context['user_id'],
        )
    )
    command_bus.dispatch(
        UpdateModelBoundaryTagsCommand(
            project_id=context['project_id'],
            model_id=context['model_id'],
            boundary_ids=[context['boundary_id']],
            tags=BoundaryTags.from_list(['pumping', 'updated']),
            user_id=context['user_id'],
        )
    )

    boundary = get_boundary(context)
    assert boundary.name.to_str() == 'Updated Well'
    assert boundary.tags.to_list() == ['pumping', 'updated']


def test_disable_and_enable_boundary(boundary_context, command_bus):
    context = boundary_context

    command_bus.dispatch(
        DisableModelBoundaryCommand(project_id=context['project_id'], model_id=context['model_id'], boundary_id=context['boundary_id'], user_id=context['user_id'])
    )
    assert get_boundary(context).enabled is False

    command_bus.dispatch(EnableModelBoundaryCommand(project_id=context['project_id'], model_id=context['model_id'], boundary_id=context['boundary_id'], user_id=context['user_id']))
    assert get_boundary(context).enabled is True


def test_update_boundary_geometry_recalculates_affected_cells(boundary_context, command_bus):
    context = boundary_context
    geometry = Point(coordinates=(13.924, 50.9658))

    command_bus.dispatch(
        UpdateModelBoundaryGeometryCommand(
            project_id=context['project_id'], model_id=context['model_id'], boundary_id=context['boundary_id'], geometry=geometry, user_id=context['user_id']
        )
    )

    boundary = get_boundary(context)
    assert boundary.geometry.type == geometry.type
    assert list(boundary.geometry.coordinates) == list(geometry.coordinates)
    assert len(boundary.affected_cells) >= 1


def test_update_boundary_affected_layers_and_interpolation(boundary_context, setup_model, command_bus, model_reader):
    context = boundary_context
    model = model_reader.get_latest_model(context['project_id'])
    layer_id = model.layers[0].layer_id

    command_bus.dispatch(
        UpdateModelBoundaryAffectedLayersCommand(
            project_id=context['project_id'],
            model_id=context['model_id'],
            boundary_ids=[context['boundary_id']],
            affected_layers=[layer_id],
            user_id=context['user_id'],
        )
    )
    command_bus.dispatch(
        UpdateModelBoundaryInterpolationCommand(
            project_id=context['project_id'],
            model_id=context['model_id'],
            boundary_ids=[context['boundary_id']],
            interpolation=InterpolationType.linear,
            user_id=context['user_id'],
        )
    )

    boundary = get_boundary(context)
    assert list(boundary.affected_layers) == [layer_id]
    assert boundary.interpolation == InterpolationType.linear


def test_update_boundary_affected_cells(boundary_context, command_bus):
    context = boundary_context
    affected_cells = ActiveCells(shape=(10, 10), data=[ActiveCell(row=1, col=2)])

    command_bus.dispatch(
        UpdateModelBoundaryAffectedCellsCommand(
            project_id=context['project_id'], model_id=context['model_id'], boundary_id=context['boundary_id'], affected_cells=affected_cells, user_id=context['user_id']
        )
    )

    updated_cells = get_boundary(context).affected_cells
    assert tuple(updated_cells.shape) == affected_cells.shape
    assert updated_cells.is_active(row=1, col=2)


def test_clone_boundary_creates_independent_id(boundary_context, command_bus):
    context = boundary_context
    clone_id = BoundaryId.new()

    command_bus.dispatch(
        CloneModelBoundaryCommand(
            project_id=context['project_id'],
            model_id=context['model_id'],
            boundary_id=context['boundary_id'],
            new_boundary_id=clone_id,
            user_id=context['user_id'],
        )
    )

    model = context['model_reader'].get_latest_model(context['project_id'])
    clone = model.boundaries.get_boundary(clone_id)
    assert clone is not None
    assert clone.id != context['boundary_id']
    assert clone.geometry == get_boundary(context).geometry


def test_remove_boundaries_removes_selected_boundary(boundary_context, command_bus):
    context = boundary_context

    command_bus.dispatch(
        RemoveModelBoundariesCommand(project_id=context['project_id'], model_id=context['model_id'], boundary_ids=[context['boundary_id']], user_id=context['user_id'])
    )

    model = context['model_reader'].get_latest_model(context['project_id'])
    assert not model.boundaries.has_boundary(context['boundary_id'])


def test_invalid_boundary_geometry_type_is_rejected(boundary_context, command_bus):
    context = boundary_context

    with pytest.raises(ValueError, match='Geometry type mismatch'):
        command_bus.dispatch(
            UpdateModelBoundaryGeometryCommand(
                project_id=context['project_id'],
                model_id=context['model_id'],
                boundary_id=context['boundary_id'],
                geometry=LineString(coordinates=[(13.9225, 50.965), (13.925, 50.966)]),
                user_id=context['user_id'],
            )
        )
