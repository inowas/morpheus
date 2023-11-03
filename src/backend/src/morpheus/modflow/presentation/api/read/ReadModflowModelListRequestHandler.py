from flask import Request

from ....application.read.ReadProjectList import ReadModflowModelListQuery, ReadModflowModelListQueryHandler


class RedModflowModelListRequestHandler:
    def handle(self, request: Request):
        query = ReadModflowModelListQuery()
        result = ReadModflowModelListQueryHandler().handle(query)
        return result.to_dict()
