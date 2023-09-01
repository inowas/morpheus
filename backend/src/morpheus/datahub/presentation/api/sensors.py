from morpheus.datahub.application.read.ReadSensorListWithLatestValuesQueryHandler import ReadSensorListWithLatestValuesQuery, ReadSensorListWithLatestValuesQueryHandler


class ReadSensorListWithLatestValuesRequestHandler:
    @staticmethod
    def handle():
        query = ReadSensorListWithLatestValuesQuery()
        query_result = ReadSensorListWithLatestValuesQueryHandler.handle(query)
        return query_result.to_list()
