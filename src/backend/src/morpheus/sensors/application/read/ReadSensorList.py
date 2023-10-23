import dataclasses

from ...infrastructure.persistence.sensors import find_all_collections, find_latest_record
from ...types import SensorList, SensorListItem


@dataclasses.dataclass(frozen=True)
class ReadSensorListQuery:
    # list of projects to filter by or all if None
    projects: list[str] | None = None


@dataclasses.dataclass(frozen=True)
class ReadSensorListQueryResult:
    data: SensorList

    def to_dict(self) -> list[dict]:
        return self.data.to_dict()


class ReadSensorListException(Exception):
    pass


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
                        name=metadata['sensor'],
                        parameters=metadata['parameters'],
                        project=metadata['project']
                    ))

            if query.projects is not None:
                items = [item for item in items if item.project in query.projects]

            items.sort(key=lambda x: x.name)

            return ReadSensorListQueryResult(SensorList(items=items))

        except Exception as e:
            raise ReadSensorListException(e)
