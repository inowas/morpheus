from flask import Request, abort

from ...application.read import ReadSensorListQuery, QueryBus


class ReadSensorListRequestHandler:
    @staticmethod
    def handle(request: Request):
        projects = ['BRA1', 'BRA2', 'DEU1', 'KAZ', 'LFF']
        result = QueryBus().execute(ReadSensorListQuery(projects=projects))
        if not result.is_success:
            return abort(400, result.data)

        return result.data.to_dict(), 200
