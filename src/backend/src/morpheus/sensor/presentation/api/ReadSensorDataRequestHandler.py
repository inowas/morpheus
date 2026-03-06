from pydantic import BaseModel

from ...application.read.ReadSensorData import ReadSensorDataQuery, ReadSensorDataQueryHandler


class ReadSensorDataRequest(BaseModel):
    gte: float | None = None
    gt: float | None = None
    lte: float | None = None
    lt: float | None = None
    excl: float | None = None
    start_timestamp: int | None = None
    end_timestamp: int | None = None
    time_resolution: str = '1D'
    date_format: str = 'iso'


class ReadSensorDataRequestHandler:
    @staticmethod
    def handle(request: ReadSensorDataRequest, project: str, sensor: str, parameter: str):
        result = ReadSensorDataQueryHandler.handle(
            ReadSensorDataQuery(
                project=project,
                sensor=sensor,
                parameter=parameter,
                start_timestamp=request.start_timestamp,
                end_timestamp=request.end_timestamp,
                gte=request.gte,
                gt=request.gt,
                lte=request.lte,
                lt=request.lt,
                excl=request.excl,
                time_resolution=request.time_resolution,
                date_format=request.date_format,
            )
        )
        return result.to_dict()
