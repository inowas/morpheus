from flask import Request

from ...application.read.ReadSensorList import ReadSensorListQuery, ReadSensorListQueryHandler


class ReadSensorListRequestHandler:
    @staticmethod
    def handle(request: Request):
        projects = ['BRA1', 'BRA2', 'DEU1', 'KAZ', 'LFF']
        result = ReadSensorListQueryHandler.handle(ReadSensorListQuery(projects=projects))
        return result.to_dict(), 200
