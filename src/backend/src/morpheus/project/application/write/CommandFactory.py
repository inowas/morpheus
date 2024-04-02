from morpheus.project.application.write.CommandName import CommandName
from morpheus.project.application.write import ModelCommands, ProjectCommands, PermissionCommands
from morpheus.project.types.User import UserId


class CommandFactory:
    user_id: UserId

    def __init__(self, user_id: UserId):
        self.user_id = user_id

    def create_from_payload(self, payload: dict):
        command_name = CommandName(payload['name'])

        if command_name == CommandName.CREATE_PROJECT:
            return ProjectCommands.CreateProjectCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.DELETE_PROJECT:
            return ProjectCommands.DeleteProjectCommand.from_dict(self.user_id, payload)

        if command_name == CommandName.UPDATE_PROJECT_METADATA:
            return ProjectCommands.UpdateProjectMetadataCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.UPDATE_PROJECT_PREVIEW_IMAGE:
            return ProjectCommands.UpdateProjectPreviewImageCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.CREATE_MODEL:
            return ModelCommands.CreateModelCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.UPDATE_MODEL_AFFECTED_CELLS:
            return ModelCommands.UpdateModelAffectedCellsCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.UPDATE_MODEL_GEOMETRY:
            return ModelCommands.UpdateModelGeometryCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.UPDATE_MODEL_GRID:
            return ModelCommands.UpdateModelGridCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.UPDATE_MODEL_TIME_DISCRETIZATION:
            return ModelCommands.UpdateModelTimeDiscretizationCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.CREATE_VERSION:
            return ModelCommands.CreateVersionCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.DELETE_VERSION:
            return ModelCommands.DeleteVersionCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.UPDATE_VERSION_DESCRIPTION:
            return ModelCommands.UpdateVersionDescriptionCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.ADD_MEMBER:
            return PermissionCommands.AddMemberCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.REMOVE_MEMBER:
            return PermissionCommands.RemoveMemberCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.UPDATE_MEMBER_ROLE:
            return PermissionCommands.UpdateMemberRoleCommand.from_payload(self.user_id, payload)

        if command_name == CommandName.UPDATE_VISIBILITY:
            return PermissionCommands.UpdateVisibilityCommand.from_payload(self.user_id, payload)

        raise ValueError(f'Command name {command_name} not recognized')
