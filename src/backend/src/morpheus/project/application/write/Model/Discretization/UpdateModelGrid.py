import dataclasses
from typing import Literal, TypedDict

from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelDiscretizationEvents import ModelAffectedCellsRecalculatedEvent, ModelGridUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.discretization.spatial import ActiveCells, Grid, Rotation
from morpheus.project.types.geometry import Point
from morpheus.project.types.Project import ProjectId


class UpdateModelGridCommandPayload(TypedDict):
    project_id: str
    n_cols: int
    n_rows: int
    origin: dict | None
    col_widths: list[float] | None
    total_width: float | None
    row_heights: list[float] | None
    total_height: float | None
    rotation: float | None
    length_unit: Literal['meters', 'centimeters', 'feet', 'unknown'] | None


@dataclasses.dataclass(frozen=True)
class UpdateModelGridCommand(ProjectCommandBase):
    n_cols: int
    n_rows: int
    origin: Point | None = None
    col_widths: list[float] | None = None
    total_width: float | None = None
    row_heights: list[float] | None = None
    total_height: float | None = None
    rotation: float | None = None
    length_unit: Literal['meters', 'centimeters', 'feet', 'unknown'] | None = None

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelGridCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            n_cols=payload['n_cols'],
            n_rows=payload['n_rows'],
            origin=Point.from_dict(payload['origin']) if 'origin' in payload else None,  # pyright: ignore
            col_widths=payload.get('col_widths'),
            total_width=payload.get('total_width'),
            row_heights=payload.get('row_heights'),
            total_height=payload.get('total_height'),
            rotation=payload.get('rotation'),
            length_unit=payload.get('length_unit'),
        )


class UpdateModelGridCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelGridCommand):
        # Todo - make grid updatable like Grid.withUpdatedWidthsAndHeights

        project_id = command.project_id
        user_id = command.user_id

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
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = ModelAffectedCellsRecalculatedEvent.from_affected_cells(project_id=project_id, affected_cells=new_affected_cells, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
