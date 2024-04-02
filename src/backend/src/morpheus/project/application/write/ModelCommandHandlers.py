from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from .ModelCommands import CreateModelCommand, UpdateModelGeometryCommand, UpdateModelGridCommand, UpdateModelAffectedCellsCommand, UpdateModelTimeDiscretizationCommand, \
    CreateVersionCommand, DeleteVersionCommand, UpdateVersionDescriptionCommand
from ..read.ModelReader import ModelReader
from ..read.PermissionsReader import PermissionsReader
from ...domain.events.ModelEvents import ModelAffectedCellsRecalculatedEvent, ModelAffectedCellsUpdatedEvent, ModelCreatedEvent, \
    ModelGeometryUpdatedEvent, ModelGridUpdatedEvent, ModelTimeDiscretizationUpdatedEvent, VersionAssignedToModelEvent, VersionCreatedEvent, VersionDeletedEvent, \
    VersionDescriptionUpdatedEvent, ModelGridRecalculatedEvent
from ...infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from ...types.ModelVersion import ModelVersion, VersionTag, VersionDescription
from ...types.Model import Model
from ...types.discretization.spatial import ActiveCells
from ...types.discretization.spatial.SpatialDiscretization import SpatialDiscretization, Rotation
from ...types.discretization.spatial.Grid import Grid


class CreateModelCommandHandler:

    @staticmethod
    def handle(command: CreateModelCommand):
        project_id = command.project_id
        model = Model.new(command.model_id)
        user_id = command.user_id

        grid = Grid.cartesian_from_polygon(
            polygon=command.geometry,
            n_cols=command.n_cols,
            n_rows=command.n_rows,
            rotation=Rotation.from_float(command.rotation),
        )

        cells = ActiveCells.from_polygon(polygon=command.geometry, grid=grid)
        spatial_discretization = SpatialDiscretization(
            geometry=command.geometry,
            affected_cells=cells,
            grid=grid,
        )

        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to create a model of {project_id.to_str()}')

        model = model.with_updated_spatial_discretization(spatial_discretization)

        event = ModelCreatedEvent.from_model(project_id=project_id, model=model, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        initial_version = ModelVersion.new(tag=VersionTag.from_str('v0.0.0'), description=VersionDescription.from_str('Initial version'))
        event = VersionCreatedEvent.from_version(project_id=project_id, version=initial_version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = VersionAssignedToModelEvent.from_version(project_id=project_id, version=initial_version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)


class UpdateModelGeometryCommandHandler:
    @staticmethod
    def handle(command: UpdateModelGeometryCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the geometry of {project_id.to_str()}')

        model_reader = ModelReader()
        model = model_reader.get_latest_model(project_id=project_id)

        new_geometry = command.geometry
        new_grid = model.spatial_discretization.grid.with_updated_geometry(new_geometry)
        new_affected_cells = ActiveCells.from_polygon(polygon=command.geometry, grid=new_grid)

        event = ModelGridRecalculatedEvent.from_grid(project_id=project_id, grid=new_grid, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = ModelGeometryUpdatedEvent.from_geometry(project_id=project_id, polygon=new_geometry, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = ModelAffectedCellsRecalculatedEvent.from_affected_cells(project_id=project_id, affected_cells=new_affected_cells, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)


class UpdateModelGridCommandHandler:
    @staticmethod
    def handle(command: UpdateModelGridCommand):
        # Todo - make grid updatable like Grid.withUpdatedWidthsAndHeights

        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        model_reader = ModelReader()
        current_grid = model_reader.get_latest_model(project_id=project_id).spatial_discretization.grid
        if current_grid is None:
            raise ValueError('The grid must be created before it can be updated')

        n_cols = command.n_cols
        n_rows = command.n_rows

        relative_col_coordinates = [1 / n_cols * i for i in range(n_cols)]
        relative_col_coordinates.append(1.0)

        relative_row_coordinates = [1 / n_rows * i for i in range(n_rows)]
        relative_row_coordinates.append(1.0)

        col_widths = command.col_widths
        total_width = command.total_width

        if col_widths is not None:
            if len(col_widths) != n_cols:
                raise ValueError('The number of column widths must match the number of columns')

            if sum(col_widths) != total_width:
                raise ValueError('The sum of the column widths must match the total width')

            if col_widths and total_width:
                relative_col_coordinates = [sum(col_widths[:i]) / total_width for i in range(n_cols)]
                relative_col_coordinates.append(1.0)

        row_heights = command.row_heights
        total_height = command.total_height

        if row_heights is not None:
            if len(row_heights) != n_rows:
                raise ValueError('The number of row heights must match the number of rows')

            if sum(row_heights) != total_height:
                raise ValueError('The sum of the row heights must match the total height')

            if row_heights and total_height:
                relative_row_coordinates = [sum(row_heights[:i]) / total_height for i in range(n_rows)]
                relative_row_coordinates.append(1.0)

        rotation = Rotation.from_float(command.rotation) if command.rotation is not None else current_grid.rotation

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the grid of {project_id.to_str()}')

        model = model_reader.get_latest_model(project_id=project_id)

        geometry = model.spatial_discretization.geometry
        new_grid = Grid.from_polygon_with_relative_coordinates(
            polygon=geometry,
            rotation=rotation,
            relative_col_coordinates=relative_col_coordinates,
            relative_row_coordinates=relative_row_coordinates,
        )

        new_affected_cells = ActiveCells.from_polygon(polygon=geometry, grid=new_grid)

        event = ModelGridUpdatedEvent.from_grid(project_id=project_id, grid=new_grid, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = ModelAffectedCellsRecalculatedEvent.from_affected_cells(project_id=project_id, affected_cells=new_affected_cells, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)


class UpdateModelAffectedCellsCommandHandler:
    @staticmethod
    def handle(command: UpdateModelAffectedCellsCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the affected cells of {project_id.to_str()}')

        event = ModelAffectedCellsUpdatedEvent.from_affected_cells(project_id=project_id, affected_cells=command.affected_cells, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)


class UpdateTimeDiscretizationCommandHandler:
    @staticmethod
    def handle(command: UpdateModelTimeDiscretizationCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the time discretization of {project_id.to_str()}')

        event = ModelTimeDiscretizationUpdatedEvent.from_time_discretization(project_id=project_id, time_discretization=command.time_discretization, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)


class CreateVersionCommandHandler:
    @staticmethod
    def handle(command: CreateVersionCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to assign a version to {project_id.to_str()}')

        version = ModelVersion.new(tag=command.version_tag, description=command.version_description)
        event = VersionCreatedEvent.from_version(project_id=project_id, version=version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = VersionAssignedToModelEvent.from_version(project_id=project_id, version=version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)


class DeleteVersionCommandHandler:
    @staticmethod
    def handle(command: DeleteVersionCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to remove a version from {project_id.to_str()}')

        event = VersionDeletedEvent.from_version_id(project_id=project_id, version_id=command.version_id)
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)


class UpdateVersionDescriptionCommandHandler:
    @staticmethod
    def handle(command: UpdateVersionDescriptionCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the description of a version of {project_id.to_str()}')

        event = VersionDescriptionUpdatedEvent.from_version_id(project_id=project_id, version_id=command.version_id, description=command.version_description,
                                                               occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
