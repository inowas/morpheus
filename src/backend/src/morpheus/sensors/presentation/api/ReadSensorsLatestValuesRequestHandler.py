from flask import Request, abort

from ...application.read.ReadSensorsLatestValues import ReadSensorsLatestValuesQuery, \
    ReadSensorsLatestValuesQueryHandler, ReadSensorsLatestValuesException


class ReadSensorsLatestValuesRequestHandler():
    @staticmethod
    def handle(request: Request):
        try:
            result = ReadSensorsLatestValuesQueryHandler.handle(ReadSensorsLatestValuesQuery())
            return result.to_dict(), 200
        except ReadSensorsLatestValuesException as e:
            return abort(500, str(e))
        except Exception as e:
            return abort(500, str(e))
