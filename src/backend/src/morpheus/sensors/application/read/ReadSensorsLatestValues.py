import dataclasses

from ...infrastructure.persistence.sensors import find_all_collections, find_latest_record
from ...types.sensor_list import SensorsLatestValues


@dataclasses.dataclass
class ReadSensorsLatestValuesQuery:
    pass


@dataclasses.dataclass
class ReadSensorsLatestValuesQueryResult:
    is_success: bool
    data: SensorsLatestValues | str


class ReadSensorsLatestValuesQueryHandler:
    @staticmethod
    def handle(query: ReadSensorsLatestValuesQuery) -> ReadSensorsLatestValuesQueryResult:
        try:
            sensor_names = [collection_name for collection_name in find_all_collections() if
                            collection_name.startswith('sensor')]

            items = {}
            for sensor_name in sensor_names:
                items[sensor_name] = find_latest_record(sensor_name)
            return ReadSensorsLatestValuesQueryResult(
                is_success=True,
                data=SensorsLatestValues(items=items)
            )
        except Exception as e:
            return ReadSensorsLatestValuesQueryResult(
                is_success=False,
                data=str(e)
            )
