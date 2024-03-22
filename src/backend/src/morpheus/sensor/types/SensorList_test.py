from morpheus.sensor.types import SensorList, SensorListItem


def test_sensor_list():
    sensor_list = SensorList(
        items=[SensorListItem(
            id='id',
            location=[1.0, 2.0],
            project='project',
            name='name',
            parameters=['parameters'])]
    )
    assert sensor_list.to_dict() == [{
        'id': 'id',
        'location': [1.0, 2.0],
        'project': 'project',
        'name': 'name',
        'parameters': ['parameters']
    }]
