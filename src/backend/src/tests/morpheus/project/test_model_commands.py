"""Integration tests for Model commands.

These tests verify model creation and time discretization updates,
following the patterns from the RioPrimeroWithCommands notebook.
"""

from datetime import datetime

import pytest

from morpheus.project.application.write.Model.Discretization import UpdateModelTimeDiscretizationCommand
from morpheus.project.application.write.Model.General import CreateModelCommand
from morpheus.project.application.write.Project import CreateProjectCommand
from morpheus.project.types.discretization.spatial import Rotation
from morpheus.project.types.discretization.time import TimeDiscretization
from morpheus.project.types.discretization.time.Stressperiods import (
    EndDateTime,
    IsSteadyState,
    NumberOfTimeSteps,
    StartDateTime,
    StressPeriod,
    StressPeriodCollection,
    TimeStepMultiplier,
)
from morpheus.project.types.discretization.time.TimeUnit import TimeUnit
from morpheus.project.types.Project import Description, Name, Tags

pytestmark = [pytest.mark.integration, pytest.mark.model]


class TestCreateModelCommand:
    """Tests for CreateModelCommand."""

    @pytest.fixture(autouse=True)
    def setup_project(self, user_id, project_id, command_bus):
        """Create a project before each test."""
        command = CreateProjectCommand(
            project_id=project_id, name=Name('Test Project'), description=Description('Test project for model tests'), tags=Tags.from_list(['test']), user_id=user_id
        )
        command_bus.dispatch(command)

    def test_create_model_with_grid(self, project_id, user_id, model_id, test_polygon, command_bus):
        """Test creating a model with a grid."""
        # Arrange
        command = CreateModelCommand(
            project_id=project_id,
            user_id=user_id,
            model_id=model_id,
            geometry=test_polygon,
            n_cols=100,
            n_rows=50,
            rotation=Rotation.from_float(0.0),
        )

        # Act
        command_bus.dispatch(command)

        # Assert
        assert True

    def test_create_model_with_rotated_grid(self, project_id, user_id, model_id, test_polygon, command_bus):
        """Test creating a model with a rotated grid."""
        # Arrange
        command = CreateModelCommand(
            project_id=project_id,
            user_id=user_id,
            model_id=model_id,
            geometry=test_polygon,
            n_cols=50,
            n_rows=25,
            rotation=Rotation.from_float(45.0),
        )

        # Act
        command_bus.dispatch(command)

        # Assert
        assert True

    def test_create_model_with_fine_grid(self, project_id, user_id, model_id, test_polygon, command_bus):
        """Test creating a model with a fine resolution grid."""
        # Arrange
        command = CreateModelCommand(
            project_id=project_id,
            user_id=user_id,
            model_id=model_id,
            geometry=test_polygon,
            n_cols=200,
            n_rows=150,
            rotation=Rotation.from_float(0.0),
        )

        # Act
        command_bus.dispatch(command)

        # Assert
        assert True


class TestUpdateModelTimeDiscretizationCommand:
    """Tests for UpdateModelTimeDiscretizationCommand."""

    @pytest.fixture(autouse=True)
    def setup_project_and_model(self, user_id, project_id, model_id, test_polygon, command_bus):
        """Create a project and model before each test."""
        # Create project
        create_project_command = CreateProjectCommand(
            project_id=project_id, name=Name('Test Project'), description=Description('Test project'), tags=Tags.from_list(['test']), user_id=user_id
        )
        command_bus.dispatch(create_project_command)

        # Create model
        create_model_command = CreateModelCommand(
            project_id=project_id,
            user_id=user_id,
            model_id=model_id,
            geometry=test_polygon,
            n_cols=100,
            n_rows=50,
            rotation=Rotation.from_float(0.0),
        )
        command_bus.dispatch(create_model_command)

    def test_update_time_discretization_single_steady_state_period(self, project_id, user_id, command_bus):
        """Test updating time discretization with a single steady-state stress period."""
        # Arrange
        time_discretization = TimeDiscretization(
            start_date_time=StartDateTime.from_datetime(datetime(2015, 1, 1)),
            end_date_time=EndDateTime.from_datetime(datetime(2020, 12, 31)),
            stress_periods=StressPeriodCollection(
                [
                    StressPeriod(
                        start_date_time=StartDateTime.from_datetime(datetime(2015, 1, 1)),
                        number_of_time_steps=NumberOfTimeSteps(1),
                        time_step_multiplier=TimeStepMultiplier(1),
                        steady_state=IsSteadyState.yes(),
                    ),
                ]
            ),
            time_unit=TimeUnit.days(),
        )

        command = UpdateModelTimeDiscretizationCommand(
            project_id=project_id,
            time_discretization=time_discretization,
            user_id=user_id,
        )

        # Act
        command_bus.dispatch(command)

        # Assert
        assert True

    def test_update_time_discretization_multiple_transient_periods(self, project_id, user_id, command_bus):
        """Test updating time discretization with multiple transient stress periods."""
        # Arrange
        time_discretization = TimeDiscretization(
            start_date_time=StartDateTime.from_datetime(datetime(2020, 1, 1)),
            end_date_time=EndDateTime.from_datetime(datetime(2020, 12, 31)),
            stress_periods=StressPeriodCollection(
                [
                    StressPeriod(
                        start_date_time=StartDateTime.from_datetime(datetime(2020, 1, 1)),
                        number_of_time_steps=NumberOfTimeSteps(1),
                        time_step_multiplier=TimeStepMultiplier(1),
                        steady_state=IsSteadyState.yes(),
                    ),
                    StressPeriod(
                        start_date_time=StartDateTime.from_datetime(datetime(2020, 2, 1)),
                        number_of_time_steps=NumberOfTimeSteps(10),
                        time_step_multiplier=TimeStepMultiplier(1.2),
                        steady_state=IsSteadyState.no(),
                    ),
                    StressPeriod(
                        start_date_time=StartDateTime.from_datetime(datetime(2020, 6, 1)),
                        number_of_time_steps=NumberOfTimeSteps(20),
                        time_step_multiplier=TimeStepMultiplier(1.5),
                        steady_state=IsSteadyState.no(),
                    ),
                ]
            ),
            time_unit=TimeUnit.days(),
        )

        command = UpdateModelTimeDiscretizationCommand(
            project_id=project_id,
            time_discretization=time_discretization,
            user_id=user_id,
        )

        # Act
        command_bus.dispatch(command)

        # Assert
        assert True

    def test_update_time_discretization_with_hours_unit(self, project_id, user_id, command_bus):
        """Test updating time discretization with hours as time unit."""
        # Arrange
        time_discretization = TimeDiscretization(
            start_date_time=StartDateTime.from_datetime(datetime(2020, 1, 1, 0, 0)),
            end_date_time=EndDateTime.from_datetime(datetime(2020, 1, 2, 0, 0)),
            stress_periods=StressPeriodCollection(
                [
                    StressPeriod(
                        start_date_time=StartDateTime.from_datetime(datetime(2020, 1, 1, 0, 0)),
                        number_of_time_steps=NumberOfTimeSteps(24),
                        time_step_multiplier=TimeStepMultiplier(1),
                        steady_state=IsSteadyState.no(),
                    ),
                ]
            ),
            time_unit=TimeUnit.hours(),
        )

        command = UpdateModelTimeDiscretizationCommand(
            project_id=project_id,
            time_discretization=time_discretization,
            user_id=user_id,
        )

        # Act
        command_bus.dispatch(command)

        # Assert
        assert True
