from flask import Request, abort

from ...application.read.ReadSensorList import ReadSensorListQuery, \
    ReadSensorListQueryHandler, ReadSensorListException


class ReadSensorListRequestHandler:
    @staticmethod
    def handle(request: Request):
        projects = ['BRA1', 'BRA2', 'DEU1', 'KAZ', 'LFF']
        try:
            result = ReadSensorListQueryHandler.handle(ReadSensorListQuery(projects=projects))
            return result.to_dict(), 200
        except ReadSensorListException as e:
            return abort(500, str(e))
        except Exception as e:
            return abort(500, str(e))
