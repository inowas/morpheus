from datetime import datetime

import pytest

from morpheus.common.types import DateTime
from morpheus.project.application.write.Model.Observations import (
    AddModelObservationCommand,
    CloneModelObservationCommand,
    DisableModelObservationCommand,
    EnableModelObservationCommand,
    RemoveModelObservationCommand,
    UpdateModelObservationCommand,
)
from morpheus.project.types.geometry import Point
from morpheus.project.types.observations.HeadObservation import (
    Head,
    HeadObservationValue,
    ObservationId,
    ObservationName,
    ObservationTags,
    ObservationType,
)

pytestmark = [pytest.mark.integration, pytest.mark.observation]


@pytest.fixture
def observation_context(setup_model, user_id, command_bus, model_reader):
    observation_id = ObservationId.new()
    project_id = setup_model['project_id']
    model_id = setup_model['model_id']

    command_bus.dispatch(
        AddModelObservationCommand(
            project_id=project_id,
            model_id=model_id,
            observation_id=observation_id,
            geometry=Point(coordinates=(13.9235, 50.9655)),
            user_id=user_id,
        )
    )
    return {'project_id': project_id, 'model_id': model_id, 'observation_id': observation_id, 'user_id': user_id, 'model_reader': model_reader}


def get_observation(context):
    model = context['model_reader'].get_latest_model(context['project_id'])
    observation = model.observations.get_observation(context['observation_id'])
    assert observation is not None
    return observation


def test_add_observation_persists_default_value(observation_context):
    observation = get_observation(observation_context)

    assert observation.type == ObservationType.head()
    assert observation.name.to_str() == 'hob-2'
    assert observation.enabled is True
    assert len(observation.data) == 1
    assert observation.data[0].head.to_value() == 0.0


def test_disable_and_enable_observation(observation_context, command_bus):
    context = observation_context

    command_bus.dispatch(
        DisableModelObservationCommand(project_id=context['project_id'], model_id=context['model_id'], observation_id=context['observation_id'], user_id=context['user_id'])
    )
    assert get_observation(context).enabled is False

    command_bus.dispatch(
        EnableModelObservationCommand(project_id=context['project_id'], model_id=context['model_id'], observation_id=context['observation_id'], user_id=context['user_id'])
    )
    assert get_observation(context).enabled is True


def test_clone_observation_creates_second_observation(observation_context, command_bus):
    context = observation_context
    clone_id = ObservationId.new()

    command_bus.dispatch(
        CloneModelObservationCommand(
            project_id=context['project_id'],
            model_id=context['model_id'],
            observation_id=context['observation_id'],
            new_observation_id=clone_id,
            user_id=context['user_id'],
        )
    )

    model = context['model_reader'].get_latest_model(context['project_id'])
    clone = model.observations.get_observation(clone_id)
    assert clone is not None
    assert clone.id != context['observation_id']
    assert clone.geometry == get_observation(context).geometry


def test_update_observation_replaces_values_and_metadata(observation_context, command_bus):
    context = observation_context
    observation = get_observation(context)
    updated_data = [HeadObservationValue(date_time=DateTime.from_datetime(datetime(2021, 1, 1)), head=Head.from_value(123.4))]

    command_bus.dispatch(
        UpdateModelObservationCommand(
            project_id=context['project_id'],
            model_id=context['model_id'],
            observation_id=context['observation_id'],
            type=observation.type,
            name=ObservationName('Calibration Point'),
            tags=ObservationTags.from_list(['calibration']),
            geometry=observation.geometry,
            affected_cells=observation.affected_cells,
            affected_layers=list(observation.affected_layers),
            data=updated_data,
            enabled=True,
            user_id=context['user_id'],
        )
    )

    updated = get_observation(context)
    assert updated.name.to_str() == 'Calibration Point'
    assert updated.tags.to_list() == ['calibration']
    assert updated.data[0].head.to_value() == 123.4


def test_remove_observation(observation_context, command_bus):
    context = observation_context

    command_bus.dispatch(
        RemoveModelObservationCommand(project_id=context['project_id'], model_id=context['model_id'], observation_id=context['observation_id'], user_id=context['user_id'])
    )

    model = context['model_reader'].get_latest_model(context['project_id'])
    assert not model.observations.has_observation(context['observation_id'])
