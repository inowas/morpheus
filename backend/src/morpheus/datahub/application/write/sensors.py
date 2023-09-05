import morpheus.datahub.infrastructure.persistence.sensors as sensor_db


def add_sensor(sensor_name: str) -> None:
    if not has_sensor(sensor_name):
        sensor_db.create_sensor_collection(sensor_name)


def has_sensor(sensor_name: str) -> bool:
    return sensor_db.collection_exists(sensor_name)


def insert_records(sensor_name: str, data: list[dict]) -> None:
    sensor_db.insert_many(sensor_name, data)


def insert_record(sensor_name: str, data: dict) -> None:
    sensor_db.insert_one(sensor_name, data)
