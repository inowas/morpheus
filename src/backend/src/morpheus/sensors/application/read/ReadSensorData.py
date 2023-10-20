import dataclasses
import json
import pandas as pd

from ...infrastructure.persistence.sensors import collection_exists, read_timeseries
from ...types.sensor_list import SensorData, SensorDataItem


@dataclasses.dataclass
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


@dataclasses.dataclass
class ReadSensorDataQueryResult:
    is_success: bool
    data: SensorData | None = None
    status_code: int | None = None
    message: str | None = None

    @classmethod
    def success(cls, data: SensorData):
        return cls(is_success=True, data=data, status_code=200)

    @classmethod
    def failure(cls, message: str, status_code: int = 400):
        return cls(is_success=False, message=message, status_code=status_code)

    def value(self):
        if self.is_success:
            return self.data
        return self.message


class InvalidTimeResolutionException(Exception):
    pass


class ReadSensorDataQueryHandler:
    @staticmethod
    def handle(query: ReadSensorDataQuery) -> ReadSensorDataQueryResult:

        valid_time_resolution_list = ['RAW', '6H', '12H', '1D', '2D', '1W']
        time_resolution = query.time_resolution.upper()
        if time_resolution not in valid_time_resolution_list:
            return ReadSensorDataQueryResult(
                is_success=False,
                message=f'Invalid timeResolution {time_resolution} provided.'
                        f'Valid values are: {", ".join(valid_time_resolution_list)}'
            )

        valid_date_formats = ['iso', 'epoch']
        date_format = query.date_format.lower()
        if date_format not in valid_date_formats:
            return ReadSensorDataQueryResult.failure(
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
            return ReadSensorDataQueryResult.failure(f'Sensor {sensor_name} does not exist', 404)

        try:
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

            df = pd.DataFrame.from_records(filtered_data)
            df['date_time'] = pd.to_datetime(df['date_time'])
            df = df.set_index('date_time')
            if time_resolution != 'RAW':
                df = df.resample(time_resolution).mean().interpolate(method='time')
                df = df.round(4)

            df = df.reset_index(level=0)
            data = json.loads(df.to_json(date_unit='s', date_format=date_format, orient='records'))
            sensor_data = []
            for item in data:
                sensor_data.append(SensorDataItem(
                    date_time=item['date_time'],
                    value=item['value'] if 'value' in item else None,
                ))

            return ReadSensorDataQueryResult.success(SensorData(items=sensor_data))

        except Exception as e:
            return ReadSensorDataQueryResult.failure(str(e))
