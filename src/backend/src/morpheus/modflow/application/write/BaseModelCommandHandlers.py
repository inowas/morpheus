import dataclasses

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from ..read.BaseModelReader import BaseModelReader
from ..read.PermissionsReader import PermissionsReader
from ...domain.events.BaseModelEvents import BaseModelAffectedCellsRecalculatedEvent, BaseModelAffectedCellsUpdatedEvent, BaseModelCreatedEvent, \
    BaseModelGeometryUpdatedEvent, BaseModelGridUpdatedEvent, BaseModelTimeDiscretizationUpdatedEvent, VersionAssignedToBaseModelEvent, VersionCreatedEvent
from ...infrastructure.event_sourcing.ModflowEventBus import modflow_event_bus
from ...types.BaseModelVersion import BaseModelVersion, VersionId, VersionTag, VersionDescription
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
            nx=command.grid_properties['nx'],
            ny=command.grid_properties['ny'],
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
        create_event = BaseModelCreatedEvent.from_base_model(project_id=project_id, base_model=base_model, occurred_at=DateTime.now())
        create_event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        create_event_envelope = EventEnvelope(event=create_event, metadata=create_event_metadata)
        modflow_event_bus.record(event_envelope=create_event_envelope)

        initial_version = BaseModelVersion(
            version_id=VersionId.new(),
            tag=VersionTag.from_str('v0.0.0'),
            description=VersionDescription.from_str('Initial version'),
        )

        create_version_event = VersionCreatedEvent.from_version(project_id=project_id, version=initial_version, occurred_at=DateTime.now())
        create_version_event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        create_version_event_envelope = EventEnvelope(event=create_version_event, metadata=create_version_event_metadata)
        modflow_event_bus.record(event_envelope=create_version_event_envelope)

        tag_version_event = VersionAssignedToBaseModelEvent.from_version(project_id=project_id, version=initial_version, occurred_at=DateTime.now())
        tag_version_event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        tag_version_event_envelope = EventEnvelope(event=tag_version_event, metadata=tag_version_event_metadata)
        modflow_event_bus.record(event_envelope=tag_version_event_envelope)


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
        project_id = command.project_id
        current_user_id = command.updated_by
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        relative_x_coordinates = command.update_grid['relative_x_coordinates']
        relative_y_coordinates = command.update_grid['relative_y_coordinates']
        rotation = Rotation.from_float(command.update_grid['rotation'])

        if not permissions.member_can_edit(user_id=current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to update the grid of {project_id.to_str()}')

        base_model_reader = BaseModelReader()
        base_model = base_model_reader.get_latest_base_model(project_id=project_id)

        geometry = base_model.spatial_discretization.geometry
        new_grid = Grid.from_polygon_with_relative_coordinates(
            polygon=geometry,
            rotation=rotation,
            x_coordinates=relative_x_coordinates,
            y_coordinates=relative_y_coordinates
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
