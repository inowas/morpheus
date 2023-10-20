from .ReadSensorData import ReadSensorDataQuery, ReadSensorDataQueryHandler
from .ReadSensorsLatestValues import ReadSensorsLatestValuesQuery, ReadSensorsLatestValuesQueryHandler
from .ReadSensorList import ReadSensorListQuery, ReadSensorListQueryHandler


class QueryBus:
    def __init__(self):
        pass

    def execute(self, query: any):
        if isinstance(query, ReadSensorDataQuery):
            return ReadSensorDataQueryHandler.handle(query)
        if isinstance(query, ReadSensorsLatestValuesQuery):
            return ReadSensorsLatestValuesQueryHandler.handle(query)
        if isinstance(query, ReadSensorListQuery):
            return ReadSensorListQueryHandler.handle(query)

        raise Exception('QueryBus: Unknown query type')
