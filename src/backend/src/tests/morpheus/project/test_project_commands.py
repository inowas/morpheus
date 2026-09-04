"""Integration tests for Project commands.

These tests verify the complete workflow of project creation and management
using command dispatching, similar to the RioPrimeroWithCommands notebook.
"""

import pytest

from morpheus.common.types.identity.Identity import GroupId, UserId
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.read.ProjectReader import get_project_reader
from morpheus.project.application.write.Project import (
    AddProjectMemberCommand,
    CreateProjectCommand,
    DeleteProjectCommand,
    RemoveProjectMemberCommand,
    UpdateProjectGroupRoleCommand,
    UpdateProjectMemberRoleCommand,
    UpdateProjectMetadataCommand,
    UpdateProjectVisibilityCommand,
)
from morpheus.project.types.Permissions import Role, Visibility
from morpheus.project.types.Project import Description, Name, Tags

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
            user_id=user_id,
        )

        # Act
        command_bus.dispatch(command)

        metadata = get_project_reader().get_metadata(project_id)
        assert metadata.name.to_str() == 'Rio Primero Test Project'
        assert metadata.description.to_str() == 'Test project for Rio Primero in Argentina'
        assert metadata.tags.to_list() == ['rio primero', 'argentina', 'test']

    def test_create_project_with_minimal_data(self, user_id, project_id, command_bus):
        """Test creating a project with minimal required data."""
        # Arrange
        command = CreateProjectCommand(project_id=project_id, name=Name('Minimal Project'), description=Description(''), tags=Tags.from_list([]), user_id=user_id)

        # Act
        command_bus.dispatch(command)

        metadata = get_project_reader().get_metadata(project_id)
        assert metadata.name.to_str() == 'Minimal Project'
        assert metadata.description.to_str() == ''
        assert metadata.tags.to_list() == []

    def test_create_project_with_special_characters_in_name(self, user_id, project_id, command_bus):
        """Test creating a project with special characters in the name."""
        # Arrange
        command = CreateProjectCommand(
            project_id=project_id,
            name=Name('Project: Test (2024) - Version #1'),
            description=Description('Test with special chars: äöü ñ é'),
            tags=Tags.from_list(['test-tag', 'tag_with_underscore']),
            user_id=user_id,
        )

        # Act
        command_bus.dispatch(command)

        metadata = get_project_reader().get_metadata(project_id)
        assert metadata.name.to_str() == 'Project: Test (2024) - Version #1'
        assert metadata.description.to_str() == 'Test with special chars: äöü ñ é'


def test_update_project_metadata(setup_project, user_id, command_bus):
    command_bus.dispatch(
        UpdateProjectMetadataCommand(
            project_id=setup_project,
            user_id=user_id,
            name=Name('Updated Project'),
            description=Description('Updated description'),
            tags=Tags.from_list(['updated']),
        )
    )

    metadata = get_project_reader().get_metadata(setup_project)
    assert metadata.name.to_str() == 'Updated Project'
    assert metadata.description.to_str() == 'Updated description'
    assert metadata.tags.to_list() == ['updated']


def test_update_project_visibility(setup_project, user_id, command_bus):
    command_bus.dispatch(UpdateProjectVisibilityCommand(project_id=setup_project, user_id=user_id, visibility=Visibility.PUBLIC))

    assert PermissionsReader().get_permissions(setup_project).visibility == Visibility.PUBLIC


def test_project_member_lifecycle(setup_project, user_id, command_bus):
    member_id = UserId.new()
    command_bus.dispatch(AddProjectMemberCommand(project_id=setup_project, user_id=user_id, new_member_id=member_id, new_member_role=Role.EDITOR))
    assert PermissionsReader().get_permissions(setup_project).members.get_member_role(member_id) == Role.EDITOR

    command_bus.dispatch(UpdateProjectMemberRoleCommand(project_id=setup_project, user_id=user_id, member_id=member_id, new_role=Role.ADMIN))
    assert PermissionsReader().get_permissions(setup_project).members.get_member_role(member_id) == Role.ADMIN

    command_bus.dispatch(RemoveProjectMemberCommand(project_id=setup_project, user_id=user_id, member_id=member_id))
    assert not PermissionsReader().get_permissions(setup_project).members.has_member(member_id)


def test_project_group_role_lifecycle(setup_project, user_id, command_bus):
    group_id = GroupId.new()
    command_bus.dispatch(UpdateProjectGroupRoleCommand(project_id=setup_project, user_id=user_id, group_id=group_id, role=Role.EDITOR))
    assert PermissionsReader().get_permissions(setup_project).groups.get_group_role(group_id) == Role.EDITOR

    command_bus.dispatch(UpdateProjectGroupRoleCommand(project_id=setup_project, user_id=user_id, group_id=group_id, role=Role.ADMIN))
    assert PermissionsReader().get_permissions(setup_project).groups.get_group_role(group_id) == Role.ADMIN

    command_bus.dispatch(UpdateProjectGroupRoleCommand(project_id=setup_project, user_id=user_id, group_id=group_id, role=None))
    assert PermissionsReader().get_permissions(setup_project).groups.get_group_role(group_id) is None


def test_delete_project_removes_project_projection(setup_project, user_id, command_bus):
    command_bus.dispatch(DeleteProjectCommand(project_id=setup_project, user_id=user_id))

    assert not get_project_reader().project_exists(setup_project)
