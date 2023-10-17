from ..application.read import reader

def read_sensor_list_with_latest_values():
    return reader.read_sensor_list_with_latest_values().to_dict()
