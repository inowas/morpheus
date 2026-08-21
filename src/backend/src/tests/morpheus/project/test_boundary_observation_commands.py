from datetime import datetime

import pytest

from morpheus.common.types import DateTime
from morpheus.project.application.write.Model.Boundaries import (
    AddModelBoundaryObservationCommand,
    CloneModelBoundaryObservationCommand,
    RemoveModelBoundaryObservationCommand,
    UpdateModelBoundaryObservationCommand,
)
from morpheus.project.types.boundaries.Boundary import BoundaryType
from morpheus.project.types.boundaries.Observation import ObservationId, ObservationName
from morpheus.project.types.geometry import Point

pytestmark = [pytest.mark.integration, pytest.mark.boundary]


def test_boundary_observation_lifecycle(boundary_context, command_bus):
    context = boundary_context
    boundary = get_boundary(context)
    observation_date = DateTime.from_datetime(datetime(2021, 1, 1))
    observation_data = [{'date_time': observation_date.to_value(), 'pumping_rate': -12.5}]

    command_bus.dispatch(
        AddModelBoundaryObservationCommand(
            project_id=context['project_id'],
            model_id=context['model_id'],
            boundary_id=context['boundary_id'],
            observation_id=ObservationId.new(),
            observation_name=ObservationName('Second pumping series'),
            observation_geometry=Point(coordinates=(13.9235, 50.9655)),
            observation_data=observation_data,
            user_id=context['user_id'],
        )
    )

    boundary = get_boundary(context)
    assert len(boundary.observations) == 2
    added_observation = boundary.observations[-1]
    assert added_observation.observation_name.to_str() == 'Second pumping series'
    assert added_observation.data[0].pumping_rate.to_value() == -12.5

    command_bus.dispatch(
        CloneModelBoundaryObservationCommand(
            project_id=context['project_id'],
            model_id=context['model_id'],
            boundary_id=context['boundary_id'],
            observation_id=added_observation.observation_id,
            user_id=context['user_id'],
        )
    )
    assert len(get_boundary(context).observations) == 3

    command_bus.dispatch(
        UpdateModelBoundaryObservationCommand(
            project_id=context['project_id'],
            model_id=context['model_id'],
            boundary_id=context['boundary_id'],
            boundary_type=BoundaryType.well,
            observation_id=added_observation.observation_id,
            observation_name=ObservationName('Updated pumping series'),
            observation_geometry=Point(coordinates=(13.924, 50.9658)),
            observation_data=[{'date_time': observation_date.to_value(), 'pumping_rate': -20.0}],
            user_id=context['user_id'],
        )
    )
    updated = get_boundary(context).get_observation(added_observation.observation_id)
    assert updated is not None
    assert updated.observation_name.to_str() == 'Updated pumping series'
    assert updated.data[0].pumping_rate.to_value() == -20.0

    command_bus.dispatch(
        RemoveModelBoundaryObservationCommand(
            project_id=context['project_id'],
            model_id=context['model_id'],
            boundary_id=context['boundary_id'],
            observation_id=added_observation.observation_id,
            user_id=context['user_id'],
        )
    )
    remaining = get_boundary(context).observations
    assert len(remaining) == 2
    assert all(observation.observation_id != added_observation.observation_id for observation in remaining)


def get_boundary(context):
    model = context['model_reader'].get_latest_model(context['project_id'])
    boundary = model.boundaries.get_boundary(context['boundary_id'])
    assert boundary is not None
    return boundary
