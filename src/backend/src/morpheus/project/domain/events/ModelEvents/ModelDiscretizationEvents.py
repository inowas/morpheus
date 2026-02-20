from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.project.types.discretization import TimeDiscretization
from morpheus.project.types.discretization.spatial import ActiveCells, Grid
from morpheus.project.types.geometry import Polygon
from morpheus.project.types.Project import ProjectId

from .EventNames import ModelDiscretizationEventName


class ModelAffectedCellsUpdatedEvent(EventBase):
    @classmethod
    def from_affected_cells(cls, project_id: ProjectId, affected_cells: ActiveCells, occurred_at: DateTime):
        return cls.create(entity_uuid=Uuid.from_str(project_id.to_str()), occurred_at=occurred_at, payload={'affected_cells': affected_cells.to_dict()})

    def get_affected_cells(self) -> ActiveCells:
        return ActiveCells.from_dict(self.payload['affected_cells'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelDiscretizationEventName.MODEL_AFFECTED_CELLS_UPDATED.to_str())


class ModelAffectedCellsRecalculatedEvent(EventBase):
    @classmethod
    def from_affected_cells(cls, project_id: ProjectId, affected_cells: ActiveCells, occurred_at: DateTime):
        return cls.create(entity_uuid=Uuid.from_str(project_id.to_str()), occurred_at=occurred_at, payload={'affected_cells': affected_cells.to_dict()})

    def get_affected_cells(self) -> ActiveCells:
        return ActiveCells.from_dict(self.payload['affected_cells'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelDiscretizationEventName.MODEL_AFFECTED_CELLS_RECALCULATED.to_str())


class ModelGeometryUpdatedEvent(EventBase):
    @classmethod
    def from_geometry(cls, project_id: ProjectId, polygon: Polygon, occurred_at: DateTime):
        return cls.create(entity_uuid=Uuid.from_str(project_id.to_str()), occurred_at=occurred_at, payload={'geometry': polygon.to_dict()})

    def get_geometry(self) -> Polygon:
        return Polygon.from_dict(self.payload['geometry'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelDiscretizationEventName.MODEL_GEOMETRY_UPDATED.to_str())


class ModelGridRecalculatedEvent(EventBase):
    @classmethod
    def from_grid(cls, project_id: ProjectId, grid: Grid, occurred_at: DateTime):
        return cls.create(entity_uuid=Uuid.from_str(project_id.to_str()), occurred_at=occurred_at, payload={'grid': grid.to_dict()})

    def get_grid(self) -> Grid:
        return Grid.from_dict(self.payload['grid'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelDiscretizationEventName.MODEL_GRID_RECALCULATED.to_str())


class ModelGridUpdatedEvent(EventBase):
    @classmethod
    def from_grid(cls, project_id: ProjectId, grid: Grid, occurred_at: DateTime):
        return cls.create(entity_uuid=Uuid.from_str(project_id.to_str()), occurred_at=occurred_at, payload={'grid': grid.to_dict()})

    def get_grid(self) -> Grid:
        return Grid.from_dict(self.payload['grid'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelDiscretizationEventName.MODEL_GRID_UPDATED.to_str())


class ModelTimeDiscretizationUpdatedEvent(EventBase):
    @classmethod
    def from_time_discretization(cls, project_id: ProjectId, time_discretization: TimeDiscretization, occurred_at: DateTime):
        return cls.create(entity_uuid=Uuid.from_str(project_id.to_str()), occurred_at=occurred_at, payload={'time_discretization': time_discretization.to_dict()})

    def get_time_discretization(self) -> TimeDiscretization:
        return TimeDiscretization.from_dict(self.payload['time_discretization'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelDiscretizationEventName.MODEL_TIME_DISCRETIZATION_UPDATED.to_str())
