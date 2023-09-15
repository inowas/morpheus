from morpheus.datahub.application.read import reader


class ReadSensorListWithLatestValuesRequestHandler:
    @staticmethod
    def handle():
        return reader.read_sensor_list_with_latest_values().to_dict()
