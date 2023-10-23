from morpheus.sensors.types import SensorData, SensorDataItem


def test_sensor_data():
    sensor_data = SensorData(items=[SensorDataItem(date_time='2021-01-01T00:00:00', value=1.0)])
    assert sensor_data.to_dict() == [{'date_time': '2021-01-01T00:00:00', 'value': 1.0}]
