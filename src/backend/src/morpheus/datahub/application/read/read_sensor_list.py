import dataclasses

from morpheus.datahub.infrastructure.persistence.sensors import find_all_collections, find_latest_record
from morpheus.datahub.types.sensor_list import SensorListWithLatestValues


class ReadSensorListWithLatestValuesQueryHandler:
    @staticmethod
    def handle() -> SensorListWithLatestValues:
        sensor_names = [collection_name for collection_name in find_all_collections() if
                        collection_name.startswith('sensor')]

        items = {}

        for sensor_name in sensor_names:
            items[sensor_name] = find_latest_record(sensor_name)

        return SensorListWithLatestValues(items=items)
