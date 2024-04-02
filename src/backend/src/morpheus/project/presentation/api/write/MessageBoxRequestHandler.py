from flask import Request, abort, Response

from ....application.write.CommandFactory import CommandFactory
from ....application.write import ProjectCommands, ProjectCommandHandlers, PermissionCommands, PermissionCommandHandlers, ModelCommands, ModelCommandHandlers
from ....incoming import get_logged_in_user_id
from ....types.User import UserId


class MessageBoxRequestHandler:
    @staticmethod
    def handle(request: Request):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id_str = get_logged_in_user_id()
        if user_id_str is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(user_id_str)

        # for the sake of simplicity, we make the mapping between the request path and the command explicit here

        payload = request.json
        command_factory = CommandFactory(user_id=user_id)
        command = command_factory.create_from_payload(payload=payload)  # type: ignore

        try:
            if isinstance(command, ProjectCommands.CreateProjectCommand):
                ProjectCommandHandlers.CreateProjectCommandHandler.handle(command)
                return Response(status=201, headers={'Location': f'/projects/{command.project_id.to_str()}'})

            if isinstance(command, ProjectCommands.DeleteProjectCommand):
                ProjectCommandHandlers.DeleteProjectCommandHandler.handle(command)

            if isinstance(command, ProjectCommands.UpdateProjectMetadataCommand):
                ProjectCommandHandlers.UpdateProjectMetadataCommandHandler.handle(command)

            if isinstance(command, ProjectCommands.UpdateProjectPreviewImageCommand):
                ProjectCommandHandlers.UpdatePreviewImageCommandHandler.handle(command)

            if isinstance(command, ModelCommands.CreateModelCommand):
                ModelCommandHandlers.CreateModelCommandHandler.handle(command)

            if isinstance(command, ModelCommands.UpdateModelAffectedCellsCommand):
                ModelCommandHandlers.UpdateModelAffectedCellsCommandHandler.handle(command)

            if isinstance(command, ModelCommands.UpdateModelGeometryCommand):
                ModelCommandHandlers.UpdateModelGeometryCommandHandler.handle(command)

            if isinstance(command, ModelCommands.UpdateModelGridCommand):
                ModelCommandHandlers.UpdateModelGridCommandHandler.handle(command)

            if isinstance(command, ModelCommands.UpdateModelTimeDiscretizationCommand):
                ModelCommandHandlers.UpdateTimeDiscretizationCommandHandler.handle(command)

            if isinstance(command, PermissionCommands.AddMemberCommand):
                PermissionCommandHandlers.AddMemberCommandHandler.handle(command)

            if isinstance(command, PermissionCommands.RemoveMemberCommand):
                PermissionCommandHandlers.RemoveMemberCommandHandler.handle(command)

            if isinstance(command, PermissionCommands.UpdateMemberRoleCommand):
                PermissionCommandHandlers.UpdateMemberRoleCommandHandler.handle(command)

            if isinstance(command, PermissionCommands.UpdateVisibilityCommand):
                PermissionCommandHandlers.UpdateVisibilityCommandHandler.handle(command)

            return Response(status=204)

        except Exception as e:
            abort(500, str(e))
