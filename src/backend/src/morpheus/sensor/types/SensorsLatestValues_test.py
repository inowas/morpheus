from morpheus.sensor.types import SensorsLatestValues


def test_sensor_list():
    sensors_latest_values = SensorsLatestValues(
        items={
            'sensor_CYP1_S1': {
                'datetime': '2021-03-27T05:00:00.000Z',
                'ec': 1.444,
                'ec_25': 1.61,
                'field_strength': 17,
                'filename': 'CYP1_S1_210327230405.csv',
                'gwd': -3.84,
                'h': 13.84,
                'h_level': 3.84,
                'metadata': {
                    'location': {},
                    'parameters': ['tab', 'ec', 'ec_25', 'field_strength', 'gwd', 'h', 'h_level', 't', 't_intern', 'v_batt'],
                    'project': 'CYP1',
                    'sensor': 'S1',
                    'sensor_name': 'sensor_CYP1_S1',
                    'source': 'uit',
                },
                't': 20.32,
                't_intern': 13.1,
                'tab': -3.84,
                'timestamp': 1616821200.0,
                'v_batt': 5.74,
            }
        }
    )
    assert sensors_latest_values.to_dict() == {
        'sensor_CYP1_S1': {
            'datetime': '2021-03-27T05:00:00.000Z',
            'ec': 1.444,
            'ec_25': 1.61,
            'field_strength': 17,
            'filename': 'CYP1_S1_210327230405.csv',
            'gwd': -3.84,
            'h': 13.84,
            'h_level': 3.84,
            'metadata': {
                'location': {},
                'parameters': ['tab', 'ec', 'ec_25', 'field_strength', 'gwd', 'h', 'h_level', 't', 't_intern', 'v_batt'],
                'project': 'CYP1',
                'sensor': 'S1',
                'sensor_name': 'sensor_CYP1_S1',
                'source': 'uit',
            },
            't': 20.32,
            't_intern': 13.1,
            'tab': -3.84,
            'timestamp': 1616821200.0,
            'v_batt': 5.74,
        },
    }
