from morpheus.datahub.infrastructure.persistence.mongodb import database


def collection_exists(sensor_name: str):
    return sensor_name in database.list_collection_names()


def create_sensor_collection(sensor_name: str) -> None:
    if sensor_name not in database.list_collection_names():
        database.create_collection(
            sensor_name,
            timeseries={
                "timeField": "timestamp",
                "metaField": "metadata",
                "granularity": "minutes"
            })


def get_sensor_collection(sensor_name: str):
    if sensor_name not in database.list_collection_names():
        raise ValueError(f'Collection {sensor_name} does not exist')
    return database[sensor_name]


def get_or_create_sensor_collection(sensor_name: str):
    if sensor_name not in database.list_collection_names():
        database.create_collection(
            sensor_name,
            timeseries={
                "timeField": "timestamp",
                "metaField": "metadata",
                "granularity": "minutes"
            })

    return database[sensor_name]


def delete_sensor_collection(sensor_name: str):
    if sensor_name in database.list_collection_names():
        database.drop_collection(sensor_name)


def insert_many(sensor_name: str, data: list[dict]):
    collection = get_or_create_sensor_collection(sensor_name)
    collection.insert_many(data)


def insert_one(sensor_name: str, data: dict):
    collection = get_or_create_sensor_collection(sensor_name)
    collection.insert_one(data)


def find(sensor_name: str, query: dict):
    collection = get_or_create_sensor_collection(sensor_name)
    return collection.find(query)


def find_all_collections():
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
