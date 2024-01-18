from ....application.read.ReadProjectList import ReadModflowModelListQuery, ReadModflowModelListQueryHandler


class ReadProjectListRequestHandler:
    def handle(self):
        query = ReadModflowModelListQuery()
        result = ReadModflowModelListQueryHandler().handle(query)
        return result.to_dict(), 200
