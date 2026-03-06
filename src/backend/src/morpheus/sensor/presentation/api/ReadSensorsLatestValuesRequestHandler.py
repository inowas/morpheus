from ...application.read.ReadSensorsLatestValues import ReadSensorsLatestValuesQuery, ReadSensorsLatestValuesQueryHandler


class ReadSensorsLatestValuesRequestHandler:
    @staticmethod
    def handle():
        result = ReadSensorsLatestValuesQueryHandler.handle(ReadSensorsLatestValuesQuery())
        return result.to_dict(), 200
