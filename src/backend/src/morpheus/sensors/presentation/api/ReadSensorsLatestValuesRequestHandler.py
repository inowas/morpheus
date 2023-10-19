from flask import Request, abort

from ...application.read import ReadSensorsLatestValuesQuery, QueryBus


class ReadSensorsLatestValuesRequestHandler():
    @staticmethod
    def handle(request: Request):
        result = QueryBus().execute(ReadSensorsLatestValuesQuery())
        if not result.is_success:
            return abort(400, result.data)

        return result.data.to_dict(), 200
