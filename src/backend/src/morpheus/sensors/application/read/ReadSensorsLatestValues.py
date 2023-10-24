import dataclasses

from ...infrastructure.persistence.sensors import find_all_collections, find_latest_record
from ...types import SensorsLatestValues


@dataclasses.dataclass
class ReadSensorsLatestValuesQuery:
    pass


@dataclasses.dataclass
class ReadSensorsLatestValuesQueryResult:
    data: SensorsLatestValues

    def to_dict(self) -> dict:
        return self.data.to_dict()


class ReadSensorsLatestValuesQueryHandler:
    @staticmethod
    def handle(query: ReadSensorsLatestValuesQuery) -> ReadSensorsLatestValuesQueryResult:
        sensor_names = [collection_name for collection_name in find_all_collections() if
                        collection_name.startswith('sensor')]

        items = {}
        for sensor_name in sensor_names:
            items[sensor_name] = find_latest_record(sensor_name)

        return ReadSensorsLatestValuesQueryResult(SensorsLatestValues(items=items))
