import dataclasses

from morpheus.common.types import Uuid
from .Model import Model, ModelId
from .boundaries.Boundary import BoundaryCollection, BoundaryId, Boundary
from .discretization import TimeDiscretization


class ScenarioId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class Scenario:
    scenario_id: ScenarioId
    time_discretization: TimeDiscretization | None
    boundaries: BoundaryCollection
    removed_boundaries: list[BoundaryId] = dataclasses.field(default_factory=list)

    @classmethod
    def new(cls):
        return cls(
            scenario_id=ScenarioId.new(),
            time_discretization=TimeDiscretization.new(),
            boundaries=BoundaryCollection.new(),
            removed_boundaries=[]
        )

    def with_updated_time_discretization(self, time_discretization: TimeDiscretization):
        return dataclasses.replace(self, time_discretization=time_discretization)

    def with_added_boundary(self, boundary: Boundary):
        return dataclasses.replace(self, boundaries=self.boundaries.with_added_boundary(boundary))

    def with_updated_boundary(self, boundary: Boundary):
        boundaries = self.boundaries
        if boundaries.has_boundary(boundary.boundary_id):
            boundaries = boundaries.with_updated_boundary(boundary)
        else:
            boundaries = boundaries.with_added_boundary(boundary)

        return dataclasses.replace(self, boundaries=boundaries)

    def with_removed_boundary(self, boundary_id: BoundaryId):
        return dataclasses.replace(self, removed_boundaries=self.removed_boundaries + [boundary_id])

    @classmethod
    def from_dict(cls, obj):
        return cls(
            scenario_id=ScenarioId.from_value(obj['scenario_id']),
            time_discretization=TimeDiscretization.from_dict(obj['time_discretization']),
            boundaries=BoundaryCollection.from_dict(obj['boundaries']),
            removed_boundaries=[BoundaryId.from_value(boundary_id) for boundary_id in obj['removed_boundaries']]
        )

    def to_dict(self) -> dict:
        return {
            'scenario_id': self.scenario_id.to_value(),
            'time_discretization': self.time_discretization.to_dict() if self.time_discretization is not None else None,
            'boundaries': self.boundaries.to_dict(),
            'removed_boundaries': [boundary_id.to_value() for boundary_id in self.removed_boundaries]
        }

    def apply_model(self, model: Model) -> 'Model':

        # merge boundaries
        merged_boundaries = self.boundaries
        for scenario_boundary in self.boundaries:
            merged_boundaries = model.boundaries.with_added_or_updated_boundary(scenario_boundary)

        for removed_boundary_id in self.removed_boundaries:
            merged_boundaries = model.boundaries.with_removed_boundary(removed_boundary_id)

        return Model(
            model_id=ModelId.from_str(self.scenario_id.to_str()),
            spatial_discretization=model.spatial_discretization,
            time_discretization=model.time_discretization if self.time_discretization is None else self.time_discretization,
            boundaries=merged_boundaries,
            observations=model.observations,
            layers=model.layers,
            transport=model.transport,
            variable_density=model.variable_density
        )


@dataclasses.dataclass(frozen=True)
class ScenarioCollection:
    scenarios: list[Scenario]

    @classmethod
    def new(cls):
        return cls(scenarios=[])

    @classmethod
    def from_dict(cls, obj):
        return cls(
            scenarios=[Scenario.from_dict(scenario) for scenario in obj['scenarios']]
        )

    def to_dict(self) -> dict:
        return {'scenarios': [scenario.to_dict() for scenario in self.scenarios]}

    def with_added_scenario(self, scenario: Scenario):
        return dataclasses.replace(self, scenarios=self.scenarios + [scenario])

    def with_updated_scenario(self, scenario: Scenario):
        return dataclasses.replace(self, scenarios=[scenario if scenario.scenario_id == s.scenario_id else s for s in self.scenarios])

    def with_removed_scenario(self, scenario_id: ScenarioId):
        return dataclasses.replace(self, scenarios=[s for s in self.scenarios if s.scenario_id != scenario_id])
