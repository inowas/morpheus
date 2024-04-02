import dataclasses
from typing import Optional, Literal

from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandName import CommandName
from morpheus.project.types.Model import ModelId
from morpheus.project.types.ModelVersion import VersionTag, VersionDescription, VersionId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.discretization import TimeDiscretization
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.geometry import Polygon, Point


@dataclasses.dataclass(frozen=True)
class CreateModelCommand(CommandBase):
    command_name = CommandName.CREATE_MODEL
    model_id: ModelId
    geometry: Polygon
    n_cols: int
    n_rows: int
    rotation: float

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, model_id: ModelId, geometry: Polygon, n_cols: int, n_rows: int, rotation: float):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            model_id=model_id,
            geometry=geometry,
            n_cols=n_cols,
            n_rows=n_rows,
            rotation=rotation,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.new(),
            geometry=Polygon.from_dict(payload['geometry']),
            n_cols=payload['n_cols'],
            n_rows=payload['n_rows'],
            rotation=payload['rotation'],
        )


@dataclasses.dataclass(frozen=True)
class UpdateModelGeometryCommand(CommandBase):
    command_name = CommandName.UPDATE_MODEL_GEOMETRY
    geometry: Polygon

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, geometry: Polygon):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            geometry=geometry,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            geometry=Polygon.from_dict(payload['geometry']),
        )


@dataclasses.dataclass(frozen=True)
class UpdateModelGridCommand(CommandBase):
    command_name = CommandName.UPDATE_MODEL_GRID
    n_cols: int
    n_rows: int
    origin: Optional[Point] = None
    col_widths: Optional[list[float]] = None
    total_width: Optional[float] = None
    row_heights: Optional[list[float]] = None
    total_height: Optional[float] = None
    rotation: Optional[float] = None
    length_unit: Optional[Literal["meters", "centimeters", "feet", "unknown"]] = None

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, n_cols: int, n_rows: int, origin: Optional[Point] = None, col_widths: Optional[list[float]] = None,
            total_width: Optional[float] = None, row_heights: Optional[list[float]] = None, total_height: Optional[float] = None, rotation: Optional[float] = None,
            length_unit: Optional[Literal["meters", "centimeters", "feet", "unknown"]] = None):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            n_cols=n_cols,
            n_rows=n_rows,
            origin=origin,
            col_widths=col_widths,
            total_width=total_width,
            row_heights=row_heights,
            total_height=total_height,
            rotation=rotation,
            length_unit=length_unit,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            n_cols=payload['n_cols'],
            n_rows=payload['n_rows'],
            origin=Point.from_dict(payload['origin']) if 'origin' in payload else None,
            col_widths=payload['col_widths'] if 'col_widths' in payload else None,
            total_width=payload['total_width'] if 'total_width' in payload else None,
            row_heights=payload['row_heights'] if 'row_heights' in payload else None,
            total_height=payload['total_height'] if 'total_height' in payload else None,
            rotation=payload['rotation'] if 'rotation' in payload else None,
            length_unit=payload['length_unit'] if 'length_unit' in payload else None,
        )


@dataclasses.dataclass(frozen=True)
class UpdateModelAffectedCellsCommand(CommandBase):
    command_name = CommandName.UPDATE_MODEL_AFFECTED_CELLS
    affected_cells: ActiveCells

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, affected_cells: ActiveCells):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            affected_cells=affected_cells,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            affected_cells=ActiveCells.from_dict(payload['affected_cells']),
        )


@dataclasses.dataclass(frozen=True)
class UpdateModelTimeDiscretizationCommand(CommandBase):
    command_name = CommandName.UPDATE_MODEL_TIME_DISCRETIZATION
    time_discretization: TimeDiscretization

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, time_discretization: TimeDiscretization):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            time_discretization=time_discretization,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            time_discretization=TimeDiscretization.from_dict(payload['time_discretization']),
        )


@dataclasses.dataclass(frozen=True)
class CreateVersionCommand(CommandBase):
    command_name = CommandName.CREATE_VERSION
    version_tag: VersionTag
    version_description: VersionDescription

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, version_tag: VersionTag, version_description: VersionDescription):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            version_tag=version_tag,
            version_description=version_description,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            version_tag=VersionTag.from_str(payload['version_tag']),
            version_description=VersionDescription.from_str(payload['version_description']),
        )


@dataclasses.dataclass(frozen=True)
class DeleteVersionCommand(CommandBase):
    command_name = CommandName.DELETE_VERSION
    version_id: VersionId

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, version_id: VersionId):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            version_id=version_id,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            version_id=VersionId.from_str(payload['version_id']),
        )


@dataclasses.dataclass(frozen=True)
class UpdateVersionDescriptionCommand(CommandBase):
    command_name = CommandName.UPDATE_VERSION_DESCRIPTION
    version_id: VersionId
    version_description: VersionDescription

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, version_id: VersionId, version_description: VersionDescription):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            version_id=version_id,
            version_description=version_description,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            version_id=VersionId.from_str(payload['version_id']),
            version_description=VersionDescription.from_str(payload['version_description']),
        )
