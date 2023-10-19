import dataclasses

from ...types.sensor_list import SensorData


@dataclasses.dataclass
class ReadSensorDataQuery:
    project: str
    sensor: str
    parameter: str


@dataclasses.dataclass
class ReadSensorDataQueryResult:
    is_success: bool
    data: SensorData | str


class ReadSensorDataQueryHandler:
    @staticmethod
    def handle(query: ReadSensorDataQuery) -> ReadSensorDataQueryResult:
        try:
            return ReadSensorDataQueryResult(
                is_success=True,
                data=SensorData(items=[])
            )

        except Exception as e:
            return ReadSensorDataQueryResult(
                is_success=False,
                data=str(e)
            )
