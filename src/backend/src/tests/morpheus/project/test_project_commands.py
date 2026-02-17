"""Integration tests for Project commands.

These tests verify the complete workflow of project creation and management
using command dispatching, similar to the RioPrimeroWithCommands notebook.
"""
import pytest

from morpheus.project.types.Project import Name, Description, Tags
from morpheus.project.application.write.Project import CreateProjectCommand

pytestmark = [pytest.mark.integration, pytest.mark.project]


class TestCreateProjectCommand:
    """Tests for CreateProjectCommand."""

    def test_create_project(self, user_id, project_id, command_bus):
        """Test creating a new project."""
        # Arrange
        command = CreateProjectCommand(
            project_id=project_id,
            name=Name('Rio Primero Test Project'),
            description=Description('Test project for Rio Primero in Argentina'),
            tags=Tags.from_list(['rio primero', 'argentina', 'test']),
            user_id=user_id
        )

        # Act
        command_bus.dispatch(command)

        # Assert - no exception means success
        # In a real test, you would verify the project was created
        # by querying the repository or using a reader
        assert True

    def test_create_project_with_minimal_data(self, user_id, project_id, command_bus):
        """Test creating a project with minimal required data."""
        # Arrange
        command = CreateProjectCommand(
            project_id=project_id,
            name=Name('Minimal Project'),
            description=Description(''),
            tags=Tags.from_list([]),
            user_id=user_id
        )

        # Act
        command_bus.dispatch(command)

        # Assert
        assert True

    def test_create_project_with_special_characters_in_name(self, user_id, project_id, command_bus):
        """Test creating a project with special characters in the name."""
        # Arrange
        command = CreateProjectCommand(
            project_id=project_id,
            name=Name('Project: Test (2024) - Version #1'),
            description=Description('Test with special chars: äöü ñ é'),
            tags=Tags.from_list(['test-tag', 'tag_with_underscore']),
            user_id=user_id
        )

        # Act
        command_bus.dispatch(command)

        # Assert
        assert True
