from ...application.read.ReadSensorsLatestValues import ReadSensorsLatestValuesQuery, ReadSensorsLatestValuesQueryHandler

SensorsLatestValuesResponse = dict[str, dict]


class ReadSensorsLatestValuesRequestHandler:
    @staticmethod
    def handle() -> tuple[SensorsLatestValuesResponse, int]:
        result = ReadSensorsLatestValuesQueryHandler.handle(ReadSensorsLatestValuesQuery())
        return result.to_dict(), 200
