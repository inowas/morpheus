import dataclasses
from morpheus.common.types.File import FilePath, FileName
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandName import CommandName
from morpheus.project.types.Asset import AssetId
from morpheus.project.types.Project import ProjectId, Description, Tags, Name
from morpheus.project.types.User import UserId


@dataclasses.dataclass(frozen=True)
class CreateProjectCommand(CommandBase):
    command_name = CommandName.CREATE_PROJECT
    name: Name
    description: Description
    tags: Tags

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, name: Name, description: Description, tags: Tags):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            name=name,
            description=description,
            tags=tags,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            name=Name.from_str(payload['name']),
            description=Description.from_str(payload['description']),
            tags=Tags.from_list(payload['tags']),
        )


@dataclasses.dataclass(frozen=True)
class DeleteProjectCommand(CommandBase):
    command_name = CommandName.DELETE_PROJECT

    @classmethod
    def from_dict(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
        )


@dataclasses.dataclass(frozen=True)
class UpdateProjectMetadataCommand(CommandBase):
    command_name = CommandName.UPDATE_PROJECT_METADATA
    name: Name | None
    description: Description | None
    tags: Tags | None

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, name: Name | None, description: Description | None, tags: Tags | None):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            name=name,
            description=description,
            tags=tags,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            name=Name.from_str(payload['name']) if 'name' in payload else None,
            description=Description.from_str(payload['description']) if 'description' in payload else None,
            tags=Tags.from_list(payload['tags']) if 'tags' in payload else None,
        )


@dataclasses.dataclass(frozen=True)
class UpdateProjectPreviewImageCommand(CommandBase):
    command_name = CommandName.UPDATE_PROJECT_PREVIEW_IMAGE
    asset_id: AssetId
    file_name: FileName
    file_path: FilePath

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, asset_id: AssetId, file_name: FileName, file_path: FilePath):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            asset_id=asset_id,
            file_name=file_name,
            file_path=file_path,
        )
