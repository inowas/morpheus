from flask import Request

from ....application.read.ReadProjectList import ReadModflowModelListQuery, ReadModflowModelListQueryHandler


class ReadProjectListRequestHandler:
    def handle(self, request: Request):
        query = ReadModflowModelListQuery()
        result = ReadModflowModelListQueryHandler().handle(query)
        return result.to_dict()