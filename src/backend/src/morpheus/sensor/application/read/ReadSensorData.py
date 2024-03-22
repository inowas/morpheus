import dataclasses
import pandas as pd

from ...infrastructure.persistence.sensors import collection_exists, read_timeseries
from ...types import SensorData, SensorDataItem


@dataclasses.dataclass(frozen=True)
class ReadSensorDataQuery:
    project: str
    sensor: str
    parameter: str
    start_timestamp: int | None
    end_timestamp: int | None
    gte: float | None
    gt: float | None
    lte: float | None
    lt: float | None
    excl: float | None
    date_format: str
    time_resolution: str


@dataclasses.dataclass(frozen=True)
class ReadSensorDataQueryResult:
    data: SensorData

    def to_dict(self) -> list[dict]:
        return self.data.to_dict()


class InvalidDateFormatException(Exception):
    pass


class InvalidTimeResolutionException(Exception):
    pass


class SensorNotFoundException(Exception):
    pass


class ReadSensorDataQueryHandler:
    @staticmethod
    def handle(query: ReadSensorDataQuery) -> ReadSensorDataQueryResult:

        valid_time_resolution_list = ['RAW', '6H', '12H', '1D', '2D', '1W', '1M', '1Y']
        time_resolution = query.time_resolution.upper()
        if time_resolution not in valid_time_resolution_list:
            raise InvalidTimeResolutionException(
                f'Invalid timeResolution {time_resolution} provided.'f'Valid values are: '
                f'{", ".join(valid_time_resolution_list)}'
            )

        valid_date_formats = ['iso', 'epoch']
        date_format = query.date_format.lower()
        if date_format not in valid_date_formats:
            raise InvalidDateFormatException(
                f'Invalid dateFormat {date_format} provided.'f'Valid values are: {", ".join(valid_date_formats)}'
            )

        start_timestamp = query.start_timestamp
        end_timestamp = query.end_timestamp
        gte = query.gte
        gt = query.gt
        lte = query.lte
        lt = query.lt
        excl = query.excl

        sensor_name = f'sensor_{query.project}_{query.sensor}'
        if not collection_exists(sensor_name):
            raise SensorNotFoundException(f'Sensor {sensor_name} does not exist')

        data = read_timeseries(sensor_name=sensor_name, parameter=query.parameter, start_timestamp=start_timestamp,
                               end_timestamp=end_timestamp)
        filtered_data = []
        for item in data:
            if item[query.parameter] is None:
                continue
            if gte is not None and item[query.parameter] < gte:
                continue
            if gt is not None and item[query.parameter] <= gt:
                continue
            if lte is not None and item[query.parameter] > lte:
                continue
            if lt is not None and item[query.parameter] >= lt:
                continue
            if excl is not None and item[query.parameter] == excl:
                continue
            filtered_data.append({
                'date_time': item['datetime'],
                'value': item[query.parameter] if query.parameter in item else None,
            })

        if len(filtered_data) == 0:
            return ReadSensorDataQueryResult(SensorData(items=[]))

        df = pd.DataFrame.from_records(filtered_data)
        df['date_time'] = pd.to_datetime(df['date_time'])
        df = df.set_index('date_time')
        if time_resolution != 'RAW':
            df = df.resample(time_resolution).mean().interpolate(method='time')
            df = df.round(4)

        df = df.reset_index(level=0)
        data = df.to_dict(orient='records')
        sensor_data = []
        for item in data:
            sensor_data.append(SensorDataItem(
                date_time=item['date_time'].strftime('%Y-%m-%dT%H:%M:%SZ'),
                value=item['value'] if 'value' in item else None,
            ))

        return ReadSensorDataQueryResult(SensorData(items=sensor_data))
