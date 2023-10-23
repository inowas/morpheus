import dataclasses

from ...infrastructure.persistence.sensors import find_all_collections, find_latest_record
from ...types import SensorsLatestValues


@dataclasses.dataclass
class ReadSensorsLatestValuesQuery:
    pass


@dataclasses.dataclass
class ReadSensorsLatestValuesQueryResult:
    is_success: bool
    data: SensorsLatestValues | None = None
    message: str | None = None
    status_code: int | None = None

    @classmethod
    def success(cls, data: SensorsLatestValues):
        return cls(is_success=True, data=data, status_code=200)

    @classmethod
    def failure(cls, message: str, status_code: int = 400):
        return cls(is_success=False, message=message, status_code=status_code)

    def value(self):
        if self.is_success:
            return self.data
        return self.message


class ReadSensorsLatestValuesQueryHandler:
    @staticmethod
    def handle(query: ReadSensorsLatestValuesQuery) -> ReadSensorsLatestValuesQueryResult:
        try:
            sensor_names = [collection_name for collection_name in find_all_collections() if
                            collection_name.startswith('sensor')]

            items = {}
            for sensor_name in sensor_names:
                items[sensor_name] = find_latest_record(sensor_name)

            return ReadSensorsLatestValuesQueryResult.success(SensorsLatestValues(items=items))

        except Exception as e:
            return ReadSensorsLatestValuesQueryResult.failure(str(e))
