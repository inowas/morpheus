from pydantic import BaseModel, Field

from ...application.read.ReadSensorData import ReadSensorDataQuery, ReadSensorDataQueryHandler


class ReadSensorDataRequest(BaseModel):
    gte: float | None = Field(default=None, examples=[0.0])
    gt: float | None = Field(default=None, examples=[0.0])
    lte: float | None = Field(default=None, examples=[100.0])
    lt: float | None = Field(default=None, examples=[100.0])
    excl: float | None = Field(default=None, examples=[-9999.0])
    start_timestamp: int | None = Field(default=None, examples=[1704067200])
    end_timestamp: int | None = Field(default=None, examples=[1704153600])
    time_resolution: str = Field(default='1D', examples=['1D'])
    date_format: str = Field(default='iso', examples=['iso'])


class SensorDataResponseItem(BaseModel):
    date_time: str = Field(..., examples=['2024-01-01T00:00:00Z'])
    value: float | None = Field(..., examples=[12.5])


SensorDataResponse = list[SensorDataResponseItem]


class ReadSensorDataRequestHandler:
    @staticmethod
    def handle(request: ReadSensorDataRequest, project: str, sensor: str, parameter: str) -> SensorDataResponse:
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
        return [SensorDataResponseItem(**item) for item in result.to_dict()]
