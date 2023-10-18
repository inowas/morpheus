from ..application.read import reader


def read_sensor_list_with_latest_values_request_handler():
    return reader.read_sensor_list_with_latest_values().to_dict()
