from flask import Request, abort

from ...application.read import ReadSensorListQuery, QueryBus


class ReadSensorListRequestHandler:
    @staticmethod
    def handle(request: Request):
        projects = ['BRA1', 'BRA2', 'DEU1', 'KAZ', 'LFF']
        result = QueryBus().execute(ReadSensorListQuery(projects=projects))
        if not result.is_success:
            return abort(result.status_code, result.message)

        return result.value().to_dict(), result.status_code
