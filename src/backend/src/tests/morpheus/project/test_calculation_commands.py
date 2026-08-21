from unittest.mock import patch

import pytest

from morpheus.project.application.read.CalculationProfilesReader import get_calculation_profiles_reader
from morpheus.project.application.write.Calculation import (
    AddCalculationProfileCommand,
    DeleteCalculationCommand,
    RemoveCalculationProfileCommand,
    StartCalculationCommand,
    StopCalculationCommand,
    UpdateCalculationProfileCommand,
)
from morpheus.project.infrastructure.persistence.CalculationRepository import get_calculation_repository
from morpheus.project.types.calculation.Calculation import CalculationId, CalculationState
from morpheus.project.types.calculation.CalculationProfile import CalculationEngineType, CalculationProfile, CalculationProfileName

pytestmark = [pytest.mark.integration, pytest.mark.calculation]


@pytest.fixture
def profile_context(setup_model, user_id, command_bus):
    project_id = setup_model['project_id']
    profile = CalculationProfile.new(CalculationEngineType.MF2005)
    command_bus.dispatch(AddCalculationProfileCommand(project_id=project_id, calculation_profile=profile, user_id=user_id))
    return {'project_id': project_id, 'model_id': setup_model['model_id'], 'profile': profile, 'user_id': user_id}


def test_add_calculation_profile_persists_profile(profile_context):
    context = profile_context
    profiles = get_calculation_profiles_reader().get_calculation_profiles(context['project_id'])

    assert context['profile'].id in [profile.id for profile in profiles]
    assert get_calculation_profiles_reader().get_selected_calculation_profile(context['project_id']) is not None


def test_update_calculation_profile(profile_context, command_bus):
    context = profile_context
    updated_profile = CalculationProfile(
        id=context['profile'].id,
        name=CalculationProfileName('Updated MF2005 profile'),
        engine_type=context['profile'].engine_type,
        engine_settings=context['profile'].engine_settings,
    )

    command_bus.dispatch(UpdateCalculationProfileCommand(project_id=context['project_id'], calculation_profile=updated_profile, user_id=context['user_id']))

    result = get_calculation_profiles_reader().get_calculation_profile(context['project_id'], context['profile'].id)
    assert result.name.to_str() == 'Updated MF2005 profile'


def test_remove_calculation_profile(profile_context, command_bus):
    context = profile_context

    command_bus.dispatch(RemoveCalculationProfileCommand(project_id=context['project_id'], calculation_profile_id=context['profile'].id, user_id=context['user_id']))

    assert context['profile'].id not in [profile.id for profile in get_calculation_profiles_reader().get_calculation_profiles(context['project_id'])]


def test_start_calculation_persists_created_state(profile_context, command_bus):
    context = profile_context
    calculation_id = CalculationId.new()

    with patch('morpheus.project.application.write.Calculation.StartCalculation.run_calculation_by_id.delay') as delay:
        command_bus.dispatch(StartCalculationCommand(project_id=context['project_id'], model_id=context['model_id'], new_calculation_id=calculation_id, user_id=context['user_id']))

    calculation = get_calculation_repository().get_calculation_by_id(calculation_id)
    assert calculation is not None
    assert calculation.state == CalculationState.CREATED
    delay.assert_called_once_with(calculation_id=calculation_id.to_str())


def test_stop_calculation_marks_calculation_canceled(profile_context, command_bus):
    context = profile_context
    calculation_id = CalculationId.new()

    with patch('morpheus.project.application.write.Calculation.StartCalculation.run_calculation_by_id.delay'):
        command_bus.dispatch(StartCalculationCommand(project_id=context['project_id'], model_id=context['model_id'], new_calculation_id=calculation_id, user_id=context['user_id']))

    command_bus.dispatch(StopCalculationCommand(project_id=context['project_id'], calculation_id=calculation_id, user_id=context['user_id']))

    calculation = get_calculation_repository().get_calculation_by_id(calculation_id)
    assert calculation is not None
    assert calculation.state == CalculationState.CANCELED


def test_delete_calculation_removes_calculation(profile_context, command_bus):
    context = profile_context
    calculation_id = CalculationId.new()

    with patch('morpheus.project.application.write.Calculation.StartCalculation.run_calculation_by_id.delay'):
        command_bus.dispatch(StartCalculationCommand(project_id=context['project_id'], model_id=context['model_id'], new_calculation_id=calculation_id, user_id=context['user_id']))

    command_bus.dispatch(DeleteCalculationCommand(project_id=context['project_id'], calculation_id=calculation_id, user_id=context['user_id']))

    assert get_calculation_repository().get_calculation_by_id(calculation_id) is None
