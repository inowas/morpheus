import dataclasses

from morpheus.datahub.infrastructure.persistence.sensors import find_all_collections, find_latest_record


@dataclasses.dataclass(frozen=True)
class ReadSensorListWithLatestValuesQuery:
    pass


@dataclasses.dataclass(frozen=True)
class ReadSensorsQueryResult:
    result: dict[str, dict[str, float]]

    def to_list(self):
        return self.result


class ReadSensorListWithLatestValuesQueryHandler:
    @staticmethod
    def handle(read_sensors_query: ReadSensorListWithLatestValuesQuery) -> ReadSensorsQueryResult:
        sensor_names = [collection_name for collection_name in find_all_collections() if
                        collection_name.startswith('sensor')]

        result = {}

        for sensor_name in sensor_names:
            result[sensor_name] = find_latest_record(sensor_name)

        return ReadSensorsQueryResult(result)
