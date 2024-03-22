import dataclasses

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from ..read.BaseModelReader import BaseModelReader
from ..read.PermissionsReader import PermissionsReader
from ...domain.events.BaseModelEvents import BaseModelAffectedCellsRecalculatedEvent, BaseModelAffectedCellsUpdatedEvent, BaseModelCreatedEvent, \
    BaseModelGeometryUpdatedEvent, BaseModelGridUpdatedEvent, BaseModelTimeDiscretizationUpdatedEvent, VersionAssignedToBaseModelEvent, VersionCreatedEvent, VersionDeletedEvent, \
    VersionDescriptionUpdatedEvent
from ...infrastructure.event_sourcing.ModflowEventBus import modflow_event_bus
from ...types.BaseModelVersion import BaseModelVersion, VersionTag, VersionDescription, VersionId
from ...types.Project import ProjectId
from ...types.User import UserId
from ...types.ModflowModel import ModflowModel, ModelId
from ...types.discretization import TimeDiscretization
from ...types.discretization.spatial import ActiveCells
from ...types.discretization.spatial.SpatialDiscretization import Polygon, SpatialDiscretization, Rotation
from ...types.discretization.spatial.Grid import CreateGridDict, Grid, UpdateGridDict


@dataclasses.dataclass(frozen=True)
class CreateBaseModelCommand:
    model_id: ModelId
    project_id: ProjectId
    geometry: Polygon
    grid_properties: CreateGridDict
    created_by: UserId


class CreateBaseModelCommandHandler:

    @staticmethod
    def handle(command: CreateBaseModelCommand):
        project_id = command.project_id
        base_model = ModflowModel.new(command.model_id)
        current_user_id = command.created_by

        grid = Grid.cartesian_from_polygon(
            polygon=command.geometry,
            rotation=Rotation.from_float(command.grid_properties['rotation']),
            n_col=command.grid_properties['n_col'],
            n_row=command.grid_properties['n_row'],
        )
        cells = ActiveCells.from_polygon(polygon=command.geometry, grid=grid)
        spatial_discretization = SpatialDiscretization(
            geometry=command.geometry,
            affected_cells=cells,
            grid=grid,
        )

        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to create a base model of {project_id.to_str()}')

        base_model = base_model.with_updated_spatial_discretization(spatial_discretization)

        event = BaseModelCreatedEvent.from_base_model(project_id=project_id, base_model=base_model, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        modflow_event_bus.record(event_envelope=event_envelope)

        initial_version = BaseModelVersion.new(tag=VersionTag.from_str('v0.0.0'), description=VersionDescription.from_str('Initial version'))
        event = VersionCreatedEvent.from_version(project_id=project_id, version=initial_version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        modflow_event_bus.record(event_envelope=event_envelope)

        event = VersionAssignedToBaseModelEvent.from_version(project_id=project_id, version=initial_version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        modflow_event_bus.record(event_envelope=event_envelope)


@dataclasses.dataclass(frozen=True)
class UpdateModelGeometryCommand:
    project_id: ProjectId
    geometry: Polygon
    updated_by: UserId


class UpdateModelGeometryCommandHandler:
    @staticmethod
    def handle(command: UpdateModelGeometryCommand):
        project_id = command.project_id
        current_user_id = command.updated_by
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to update the geometry of {project_id.to_str()}')

        base_model_reader = BaseModelReader()
        base_model = base_model_reader.get_latest_base_model(project_id=project_id)

        new_geometry = command.geometry
        new_affected_cells = ActiveCells.from_polygon(polygon=command.geometry, grid=base_model.spatial_discretization.grid)

        event = BaseModelGeometryUpdatedEvent.from_geometry(project_id=project_id, polygon=new_geometry, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        modflow_event_bus.record(event_envelope=event_envelope)

        event = BaseModelAffectedCellsRecalculatedEvent.from_affected_cells(project_id=project_id, affected_cells=new_affected_cells, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        modflow_event_bus.record(event_envelope=event_envelope)


@dataclasses.dataclass(frozen=True)
class UpdateModelGridCommand:
    project_id: ProjectId
    update_grid: UpdateGridDict
    updated_by: UserId


class UpdateModelGridCommandHandler:
    @staticmethod
    def handle(command: UpdateModelGridCommand):
        # Todo - make grid updatable like Grid.withUpdatedWidthsAndHeights

        project_id = command.project_id
        current_user_id = command.updated_by
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        base_model_reader = BaseModelReader()
        current_grid = base_model_reader.get_latest_base_model(project_id=project_id).spatial_discretization.grid
        if current_grid is None:
            raise ValueError('The grid must be created before it can be updated')

        rotation = current_grid.rotation

        n_col = command.update_grid.get('n_col')
        n_row = command.update_grid.get('n_row')

        relative_col_coordinates = [1 / n_col * i for i in range(n_col)]
        relative_col_coordinates.append(1.0)

        relative_row_coordinates = [1 / n_row * i for i in range(n_row)]
        relative_row_coordinates.append(1.0)

        col_widths = command.update_grid.get('col_widths', None)
        total_width = command.update_grid.get('total_width', None)

        if col_widths is not None:
            if len(col_widths) != n_col:
                raise ValueError('The number of column widths must match the number of columns')

            if sum(col_widths) != total_width:
                raise ValueError('The sum of the column widths must match the total width')

            if col_widths and total_width:
                relative_col_coordinates = [sum(col_widths[:i]) / total_width for i in range(n_col)]
                relative_col_coordinates.append(1.0)

        row_heights = command.update_grid.get('row_heights', None)
        total_height = command.update_grid.get('total_height', None)

        if row_heights is not None:
            if len(row_heights) != n_row:
                raise ValueError('The number of row heights must match the number of rows')

            if sum(row_heights) != total_height:
                raise ValueError('The sum of the row heights must match the total height')

            if row_heights and total_height:
                relative_row_coordinates = [sum(row_heights[:i]) / total_height for i in range(n_row)]
                relative_row_coordinates.append(1.0)

        if not permissions.member_can_edit(user_id=current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to update the grid of {project_id.to_str()}')

        base_model = base_model_reader.get_latest_base_model(project_id=project_id)

        geometry = base_model.spatial_discretization.geometry
        new_grid = Grid.from_polygon_with_relative_coordinates(
            polygon=geometry,
            rotation=rotation,
            relative_col_coordinates=relative_col_coordinates,
            relative_row_coordinates=relative_row_coordinates,
        )

        new_affected_cells = ActiveCells.from_polygon(polygon=geometry, grid=new_grid)

        event = BaseModelGridUpdatedEvent.from_grid(project_id=project_id, grid=new_grid, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        modflow_event_bus.record(event_envelope=event_envelope)

        event = BaseModelAffectedCellsRecalculatedEvent.from_affected_cells(project_id=project_id, affected_cells=new_affected_cells, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        modflow_event_bus.record(event_envelope=event_envelope)


@dataclasses.dataclass(frozen=True)
class UpdateModelAffectedCellsCommand:
    project_id: ProjectId
    affected_cells: ActiveCells
    updated_by: UserId


class UpdateModelAffectedCellsCommandHandler:
    @staticmethod
    def handle(command: UpdateModelAffectedCellsCommand):
        project_id = command.project_id
        current_user_id = command.updated_by
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to update the affected cells of {project_id.to_str()}')

        event = BaseModelAffectedCellsUpdatedEvent.from_affected_cells(project_id=project_id, affected_cells=command.affected_cells, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        modflow_event_bus.record(event_envelope=event_envelope)


@dataclasses.dataclass(frozen=True)
class UpdateModelTimeDiscretizationCommand:
    project_id: ProjectId
    time_discretization: TimeDiscretization
    updated_by: UserId


class UpdateTimeDiscretizationCommandHandler:
    @staticmethod
    def handle(command: UpdateModelTimeDiscretizationCommand):
        project_id = command.project_id
        current_user_id = command.updated_by
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to update the time discretization of {project_id.to_str()}')

        event = BaseModelTimeDiscretizationUpdatedEvent.from_time_discretization(project_id=project_id, time_discretization=command.time_discretization, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        modflow_event_bus.record(event_envelope=event_envelope)


@dataclasses.dataclass(frozen=True)
class SetVersionCommand:
    project_id: ProjectId
    version_tag: VersionTag
    version_description: VersionDescription
    created_by: UserId


class SetVersionCommandHandler:
    @staticmethod
    def handle(command: SetVersionCommand):
        project_id = command.project_id
        current_user_id = command.created_by
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to assign a version to {project_id.to_str()}')

        version = BaseModelVersion.new(tag=command.version_tag, description=command.version_description)
        event = VersionCreatedEvent.from_version(project_id=project_id, version=version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        modflow_event_bus.record(event_envelope=event_envelope)

        event = VersionAssignedToBaseModelEvent.from_version(project_id=project_id, version=version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        modflow_event_bus.record(event_envelope=event_envelope)


@dataclasses.dataclass(frozen=True)
class UpdateVersionDescriptionCommand:
    project_id: ProjectId
    version_id: VersionId
    version_description: VersionDescription
    updated_by: UserId


class UpdateVersionDescriptionCommandHandler:
    @staticmethod
    def handle(command: UpdateVersionDescriptionCommand):
        project_id = command.project_id
        current_user_id = command.updated_by
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to update the description of a version of {project_id.to_str()}')

        event = VersionDescriptionUpdatedEvent.from_version_id(project_id=project_id, version_id=command.version_id, description=command.version_description,
                                                               occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        modflow_event_bus.record(event_envelope=event_envelope)


@dataclasses.dataclass(frozen=True)
class DeleteVersionCommand:
    project_id: ProjectId
    version_id: VersionId
    removed_by: UserId


class DeleteVersionCommandHandler:
    @staticmethod
    def handle(command: DeleteVersionCommand):
        project_id = command.project_id
        current_user_id = command.removed_by
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to remove a version from {project_id.to_str()}')

        event = VersionDeletedEvent.from_version_id(project_id=project_id, version_id=command.version_id)
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        modflow_event_bus.record(event_envelope=event_envelope)
