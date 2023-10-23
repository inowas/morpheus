import dataclasses

from ...infrastructure.persistence.sensors import find_all_collections, find_latest_record
from ...types import SensorList, SensorListItem


@dataclasses.dataclass
class ReadSensorListQuery:
    # list of projects to filter by or all if None
    projects: list[str] | None = None


@dataclasses.dataclass
class ReadSensorListQueryResult:
    is_success: bool
    data: SensorList | None = None
    message: str | None = None
    status_code: int | None = None

    @classmethod
    def success(cls, data: SensorList):
        return cls(is_success=True, data=data, status_code=200)

    @classmethod
    def failure(cls, message: str, status_code: int = 400):
        return cls(is_success=False, message=message, status_code=status_code)

    def value(self):
        if self.is_success:
            return self.data
        return self.message


class ReadSensorListQueryHandler:
    @staticmethod
    def handle(query: ReadSensorListQuery) -> ReadSensorListQueryResult:
        try:
            sensor_names = [collection_name for collection_name in find_all_collections() if
                            collection_name.startswith('sensor')]

            items = []
            for sensor_name in sensor_names:
                latest_record = find_latest_record(sensor_name)
                if latest_record is not None:
                    metadata = latest_record['metadata']
                    items.append(SensorListItem(
                        id=sensor_name,
                        location=metadata['location'] if 'location' in metadata else [],
                        name=sensor_name,
                        parameters=metadata['parameters'],
                        project=metadata['project']
                    ))

            if query.projects is not None:
                items = [item for item in items if item.project in query.projects]

            items.sort(key=lambda x: x.name)

            return ReadSensorListQueryResult.success(SensorList(items=items))

        except Exception as e:
            return ReadSensorListQueryResult.failure(str(e))
