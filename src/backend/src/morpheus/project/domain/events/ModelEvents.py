import dataclasses

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.project.domain.events.ProjectEventName import ProjectEventName
from morpheus.project.types.Model import Model
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.ModelVersion import ModelVersion, VersionId, VersionDescription
from morpheus.project.types.discretization import TimeDiscretization
from morpheus.project.types.discretization.spatial import Grid, ActiveCells
from morpheus.project.types.geometry import Polygon


class ModelAffectedCellsUpdatedEvent(EventBase):
    @classmethod
    def from_affected_cells(cls, project_id: ProjectId, affected_cells: ActiveCells, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'affected_cells': affected_cells.to_dict()
            }
        )

    def get_affected_cells(self) -> ActiveCells:
        return ActiveCells.from_dict(self.payload['affected_cells'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_AFFECTED_CELLS_UPDATED.to_str())


class ModelAffectedCellsRecalculatedEvent(EventBase):
    @classmethod
    def from_affected_cells(cls, project_id: ProjectId, affected_cells: ActiveCells, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'affected_cells': affected_cells.to_dict()
            }
        )

    def get_affected_cells(self) -> ActiveCells:
        return ActiveCells.from_dict(self.payload['affected_cells'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_AFFECTED_CELLS_RECALCULATED.to_str())


@dataclasses.dataclass(frozen=True)
class ModelCreatedEvent(EventBase):
    @classmethod
    def from_model(cls, project_id: ProjectId, model: Model, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload=model.to_dict(),
        )

    def get_model(self) -> Model:
        return Model.from_dict(obj=self.payload)

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_CREATED.to_str())


class ModelGeometryUpdatedEvent(EventBase):
    @classmethod
    def from_geometry(cls, project_id: ProjectId, polygon: Polygon, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'geometry': polygon.to_dict()
            }
        )

    def get_geometry(self) -> Polygon:
        return Polygon.from_dict(self.payload['geometry'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_GEOMETRY_UPDATED.to_str())


class ModelGridRecalculatedEvent(EventBase):
    @classmethod
    def from_grid(cls, project_id: ProjectId, grid: Grid, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'grid': grid.to_dict()
            }
        )

    def get_grid(self) -> Grid:
        return Grid.from_dict(self.payload['grid'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_GRID_RECALCULATED.to_str())


class ModelGridUpdatedEvent(EventBase):
    @classmethod
    def from_grid(cls, project_id: ProjectId, grid: Grid, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'grid': grid.to_dict()
            }
        )

    def get_grid(self) -> Grid:
        return Grid.from_dict(self.payload['grid'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_GRID_UPDATED.to_str())


class ModelTimeDiscretizationUpdatedEvent(EventBase):
    @classmethod
    def from_time_discretization(cls, project_id: ProjectId, time_discretization: TimeDiscretization, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'time_discretization': time_discretization.to_dict()
            }
        )

    def get_time_discretization(self) -> TimeDiscretization:
        return TimeDiscretization.from_dict(self.payload['time_discretization'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_TIME_DISCRETIZATION_UPDATED.to_str())


class VersionCreatedEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: ModelVersion, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload=version.to_dict(),
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.VERSION_CREATED.to_str())

    def get_version(self) -> ModelVersion:
        return ModelVersion.from_dict(self.payload)


class VersionAssignedToModelEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: ModelVersion, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version.version_id.to_str()},
        )

    @classmethod
    def from_version_id(cls, project_id: ProjectId, version_id: VersionId, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version_id.to_str()},
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.VERSION_ASSIGNED_TO_MODEL.to_str())

    def get_version_id(self) -> VersionId:
        return VersionId.from_str(self.payload['version_id'])


class VersionDeletedEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: ModelVersion, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version.version_id.to_str()},
        )

    @classmethod
    def from_version_id(cls, project_id: ProjectId, version_id: VersionId, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version_id.to_str()},
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.VERSION_DELETED.to_str())

    def get_version_id(self) -> VersionId:
        return VersionId.from_str(self.payload['version_id'])


class VersionDescriptionUpdatedEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: ModelVersion, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version.version_id.to_str(), 'description': version.description.to_str()},
        )

    @classmethod
    def from_version_id(cls, project_id: ProjectId, version_id: VersionId, description: VersionDescription, occurred_at: DateTime = DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version_id.to_str(), 'description': description.to_str()},
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.VERSION_DESCRIPTION_UPDATED.to_str())

    def get_version_id(self) -> VersionId:
        return VersionId.from_str(self.payload['version_id'])

    def get_description(self) -> VersionDescription:
        return VersionDescription.from_str(self.payload['description'])
