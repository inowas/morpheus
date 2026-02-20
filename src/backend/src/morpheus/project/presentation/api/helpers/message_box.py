from flask import Response

from morpheus.common.types.identity.Identity import Identity
from morpheus.project.application.read.PermissionsReader import permissions_reader
from morpheus.project.application.write.Calculation import AddCalculationProfileCommand, StartCalculationCommand
from morpheus.project.application.write.CommandBase import CommandBase, ProjectCommandBase
from morpheus.project.application.write.Model.Boundaries import AddModelBoundaryCommand, AddModelBoundaryObservationCommand, CloneModelBoundaryCommand
from morpheus.project.application.write.Model.General import CreateModelCommand, CreateModelVersionCommand
from morpheus.project.application.write.Model.Layers import CloneModelLayerCommand, CreateModelLayerCommand
from morpheus.project.application.write.Model.Observations import AddModelObservationCommand, CloneModelObservationCommand
from morpheus.project.application.write.Project import (
    AddProjectMemberCommand,
    CreateProjectCommand,
    DeleteProjectCommand,
    RemoveProjectMemberCommand,
    UpdateProjectMemberRoleCommand,
    UpdateProjectVisibilityCommand,
)
from morpheus.project.types.permissions.Privilege import Privilege


def generate_response_for(command: CommandBase) -> Response:
    if isinstance(command, CreateProjectCommand):
        return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}'})

    if isinstance(command, AddCalculationProfileCommand):
        return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/calculation-profiles/{command.calculation_profile.id.to_str()}'})

    if isinstance(command, AddModelObservationCommand):
        return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/observations/{command.observation_id.to_str()}'})

    if isinstance(command, CreateModelCommand):
        return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model'})

    if isinstance(command, CreateModelVersionCommand):
        return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/versions/{command.version_tag.to_str()}'})

    if isinstance(command, CreateModelLayerCommand):
        return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/layers/{command.layer_id.to_str()}'})

    if isinstance(command, CloneModelLayerCommand):
        return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/layers/{command.new_layer_id.to_str()}'})

    if isinstance(command, CloneModelObservationCommand):
        return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/observations/{command.new_observation_id.to_str()}'})

    if isinstance(command, AddModelBoundaryCommand):
        return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/boundaries/{command.boundary_id.to_str()}'})

    if isinstance(command, CloneModelBoundaryCommand):
        return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/boundaries/{command.new_boundary_id.to_str()}'})

    if isinstance(command, StartCalculationCommand):
        return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/calculations/{command.new_calculation_id.to_str()}'})

    if isinstance(command, AddModelBoundaryObservationCommand):
        return Response(
            status=201,
            headers={'location': f'projects/{command.project_id.to_str()}/model/boundaries/{command.boundary_id.to_str()}/observations/{command.observation_id.to_str()}'},
        )

    return Response(status=204)


def assert_identity_can_execute_command(identity: Identity, command: CommandBase):
    # everyone can create a project
    if isinstance(command, CreateProjectCommand):
        return

    # you need full access privilege to delete a project
    if isinstance(command, DeleteProjectCommand):
        permissions_reader.assert_identity_can(Privilege.FULL_ACCESS, identity, command.project_id)
        return

    # you need management privilege to edit members and visibility of a project
    MANAGE_PROJECT_COMMANDS = (
        AddProjectMemberCommand,
        RemoveProjectMemberCommand,
        UpdateProjectMemberRoleCommand,
        UpdateProjectVisibilityCommand,
    )

    if isinstance(command, MANAGE_PROJECT_COMMANDS):
        permissions_reader.assert_identity_can(Privilege.MANAGE_PROJECT, identity, command.project_id)
        return

    # you need edit privilege to execute any other project related command
    if isinstance(command, ProjectCommandBase):
        permissions_reader.assert_identity_can(Privilege.EDIT_PROJECT, identity, command.project_id)
        return

    raise ValueError(f'Unknown command: {command.__class__.__name__}')
