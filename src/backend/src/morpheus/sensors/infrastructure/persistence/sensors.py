from morpheus.sensors.infrastructure.persistence.mongodb import get_database
from datetime import datetime


def collection_exists(sensor_name: str):
    database = get_database()
    return sensor_name in database.list_collection_names()


def create_sensor_collection(sensor_name: str, time_field: str, meta_field: str, granularity: str) -> None:
    valid_granularities: list[str] = ['seconds', 'minutes', 'hours']
    if granularity not in valid_granularities:
        raise ValueError(f'Granularity {granularity} is not valid. Valid granularities are: {valid_granularities}')

    database = get_database()
    if sensor_name not in database.list_collection_names():
        database.create_collection(
            sensor_name,
            timeseries={
                "timeField": time_field,
                "metaField": meta_field,
                "granularity": granularity
            })


def get_sensor_collection(sensor_name: str):
    database = get_database()
    if sensor_name not in database.list_collection_names():
        raise ValueError(f'Collection {sensor_name} does not exist')
    return database[sensor_name]


def delete_sensor_collection(sensor_name: str):
    database = get_database()
    if sensor_name in database.list_collection_names():
        database.drop_collection(sensor_name)


def insert_many(sensor_name: str, data: list[dict]):
    collection = get_sensor_collection(sensor_name)
    collection.insert_many(data)


def insert_one(sensor_name: str, data: dict):
    collection = get_sensor_collection(sensor_name)
    collection.insert_one(data)


def find(sensor_name: str, query: dict):
    collection = get_sensor_collection(sensor_name)
    return collection.find(query)


def find_all_collections():
    database = get_database()
    return database.list_collection_names()


def find_latest_record(sensor_name: str):
    collection = get_sensor_collection(sensor_name)
    return list(collection.aggregate([
        {"$match": {}},
        {"$sort": {"timestamp": -1}},
        {"$limit": 1},
        {"$addFields": {
            "timestamp": {
                "$divide": [
                    {"$toLong": "$timestamp"},
                    1000
                ]
            },
            "datetime": {
                "$dateToString": {
                    "format": "%Y-%m-%dT%H:%M:%S.000Z",
                    "date": "$timestamp"
                }
            },
        }},
        {"$project": {
            "_id": 0
        }},
    ]))[0]


def read_timeseries(sensor_name: str, parameter: str,
                    start_timestamp: int | None = 0, end_timestamp: int | None = None):

    collection = get_sensor_collection(sensor_name)
    start_date = datetime.fromtimestamp(0 if start_timestamp is None else start_timestamp)
    end_date = datetime.now() if end_timestamp is None else datetime.fromtimestamp(end_timestamp)

    return list(collection.aggregate([
        {"$match": {
            "timestamp": {
                "$gte": start_date,
                "$lte": end_date
            }
        }},
        {"$sort": {"timestamp": 1}},
        {"$addFields": {
            "timestamp": {
                "$toInt": [
                    {"$divide": [
                        {"$toLong": "$timestamp"},
                        1000
                    ]},
                ]
            },
            "datetime": {
                "$dateToString": {
                    "format": "%Y-%m-%dT%H:%M:%S.000Z",
                    "date": "$timestamp"
                }
            },
        }},
        {"$project": {
            "_id": 0,
            "datetime": 1,
            "timestamp": 1,
            parameter: 1,
        }},
    ]))
