import dataclasses

from morpheus.common.types import Uuid
from .boundaries.Boundary import BoundaryCollection
from .discretization import TimeDiscretization


class ScenarioId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class Scenario:
    scenario_id: ScenarioId
    time_discretization: TimeDiscretization
    boundaries: BoundaryCollection
    removed_boundaries: BoundaryCollection

    @classmethod
    def new(cls):
        return cls(
            scenario_id=ScenarioId.new(),
            time_discretization=TimeDiscretization.new(),
            boundaries=BoundaryCollection.new(),
            removed_boundaries=BoundaryCollection.new()
        )

    def with_updated_time_discretization(self, time_discretization: TimeDiscretization):
        return dataclasses.replace(self, time_discretization=time_discretization)

    def with_updated_boundaries(self, boundaries: BoundaryCollection):
        return dataclasses.replace(self, boundaries=boundaries)

    def with_updated_removed_boundaries(self, removed_boundaries: BoundaryCollection):
        return dataclasses.replace(self, removed_boundaries=removed_boundaries)

    @classmethod
    def from_dict(cls, obj):
        return cls(
            scenario_id=ScenarioId.from_value(obj['scenario_id']),
            time_discretization=TimeDiscretization.from_dict(obj['time_discretization']),
            boundaries=BoundaryCollection.from_list(obj['boundaries']),
            removed_boundaries=BoundaryCollection.from_list(obj['removed_boundaries'])
        )

    def to_dict(self) -> dict:
        return {
            'scenario_id': self.scenario_id.to_value(),
            'time_discretization': self.time_discretization.to_dict(),
            'boundaries': self.boundaries.to_list(),
            'removed_boundaries': self.removed_boundaries.to_list()
        }
