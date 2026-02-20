from flask import Request

from ...application.read.ReadSensorsLatestValues import ReadSensorsLatestValuesQuery, ReadSensorsLatestValuesQueryHandler


class ReadSensorsLatestValuesRequestHandler:
    @staticmethod
    def handle(request: Request):
        result = ReadSensorsLatestValuesQueryHandler.handle(ReadSensorsLatestValuesQuery())
        return result.to_dict(), 200
