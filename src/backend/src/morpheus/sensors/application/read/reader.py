from morpheus.sensors.application.read.read_sensor_list import ReadSensorListWithLatestValuesQueryHandler
from morpheus.sensors.types.sensor_list import SensorListWithLatestValues


def read_sensor_list_with_latest_values() -> SensorListWithLatestValues:
    return ReadSensorListWithLatestValuesQueryHandler.handle()
