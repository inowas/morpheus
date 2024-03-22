import dataclasses

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from ..read.ModelReader import ModelReader
from ..read.PermissionsReader import PermissionsReader
from ...domain.events.ModelEvents import ModelAffectedCellsRecalculatedEvent, ModelAffectedCellsUpdatedEvent, ModelCreatedEvent, \
    ModelGeometryUpdatedEvent, ModelGridUpdatedEvent, ModelTimeDiscretizationUpdatedEvent, VersionAssignedToModelEvent, VersionCreatedEvent, VersionDeletedEvent, \
    VersionDescriptionUpdatedEvent
from ...infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from ...types.ModelVersion import ModelVersion, VersionTag, VersionDescription, VersionId
from ...types.Project import ProjectId
from ...types.User import UserId
from ...types.Model import Model, ModelId
from ...types.discretization import TimeDiscretization
from ...types.discretization.spatial import ActiveCells
from ...types.discretization.spatial.SpatialDiscretization import Polygon, SpatialDiscretization, Rotation
from ...types.discretization.spatial.Grid import CreateGridDict, Grid, UpdateGridDict


@dataclasses.dataclass(frozen=True)
class CreateModelCommand:
    model_id: ModelId
    project_id: ProjectId
    geometry: Polygon
    grid_properties: CreateGridDict
    created_by: UserId


class CreateModelCommandHandler:

    @staticmethod
    def handle(command: CreateModelCommand):
        project_id = command.project_id
        model = Model.new(command.model_id)
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
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to create a model of {project_id.to_str()}')

        model = model.with_updated_spatial_discretization(spatial_discretization)

        event = ModelCreatedEvent.from_model(project_id=project_id, model=model, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        initial_version = ModelVersion.new(tag=VersionTag.from_str('v0.0.0'), description=VersionDescription.from_str('Initial version'))
        event = VersionCreatedEvent.from_version(project_id=project_id, version=initial_version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = VersionAssignedToModelEvent.from_version(project_id=project_id, version=initial_version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)


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

        model_reader = ModelReader()
        model = model_reader.get_latest_model(project_id=project_id)

        new_geometry = command.geometry
        new_affected_cells = ActiveCells.from_polygon(polygon=command.geometry, grid=model.spatial_discretization.grid)

        event = ModelGeometryUpdatedEvent.from_geometry(project_id=project_id, polygon=new_geometry, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = ModelAffectedCellsRecalculatedEvent.from_affected_cells(project_id=project_id, affected_cells=new_affected_cells, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)


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

        model_reader = ModelReader()
        model = model_reader.get_latest_model(project_id=project_id)

        geometry = model.spatial_discretization.geometry
        new_grid = Grid.from_polygon_with_relative_coordinates(
            polygon=geometry,
            rotation=rotation,
            x_coordinates=relative_x_coordinates,
            y_coordinates=relative_y_coordinates
        )

        new_affected_cells = ActiveCells.from_polygon(polygon=geometry, grid=new_grid)

        event = ModelGridUpdatedEvent.from_grid(project_id=project_id, grid=new_grid, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = ModelAffectedCellsRecalculatedEvent.from_affected_cells(project_id=project_id, affected_cells=new_affected_cells, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)


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

        event = ModelAffectedCellsUpdatedEvent.from_affected_cells(project_id=project_id, affected_cells=command.affected_cells, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)


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

        event = ModelTimeDiscretizationUpdatedEvent.from_time_discretization(project_id=project_id, time_discretization=command.time_discretization, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)


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

        version = ModelVersion.new(tag=command.version_tag, description=command.version_description)
        event = VersionCreatedEvent.from_version(project_id=project_id, version=version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = VersionAssignedToModelEvent.from_version(project_id=project_id, version=version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)


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
        project_event_bus.record(event_envelope=event_envelope)


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
        project_event_bus.record(event_envelope=event_envelope)
