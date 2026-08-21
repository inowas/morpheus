from pydantic import BaseModel, Field

from ...application.read.ReadSensorList import ReadSensorListQuery, ReadSensorListQueryHandler


class SensorListResponseItem(BaseModel):
    id: str = Field(..., examples=['sensor_BRA1_example'])
    location: list[float] = Field(..., examples=[[13.4, 52.5]])
    project: str = Field(..., examples=['BRA1'])
    name: str = Field(..., examples=['Example sensor'])
    parameters: list[str] = Field(..., examples=[['head']])


SensorListResponse = list[SensorListResponseItem]


class ReadSensorListRequestHandler:
    @staticmethod
    def handle() -> tuple[SensorListResponse, int]:
        projects = ['BRA1', 'BRA2', 'DEU1', 'KAZ', 'LFF']
        result = ReadSensorListQueryHandler.handle(ReadSensorListQuery(projects=projects))
        response = [SensorListResponseItem(**item) for item in result.to_dict()]
        return [item.model_dump() for item in response], 200
