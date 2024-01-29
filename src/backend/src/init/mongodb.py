import os

from pymongo import MongoClient


def read_env_var(name: str) -> str:
    value = os.environ.get(name)
    if value is None:
        raise Exception(f"Environment variable {name} not set")

    return value


print('creating users for mongodb')

host = read_env_var('BACKEND_MONGO_HOST')
port = read_env_var('BACKEND_MONGO_PORT')
root_user = read_env_var('BACKEND_MONGO_INITDB_ROOT_USERNAME')
root_password = read_env_var('BACKEND_MONGO_INITDB_ROOT_PASSWORD')
db_user = read_env_var('BACKEND_MONGO_USER')
db_password = read_env_var('BACKEND_MONGO_PASSWORD')
databases = [
    read_env_var('BACKEND_MONGO_SENSOR_DATABASE'),
    read_env_var('BACKEND_MONGO_MODFLOW_DATABASE')
]

client = MongoClient(host=host, port=int(port), username=root_user, password=root_password)

for database in databases:
    users_info = client[database].command('usersInfo')
    existing_user = next((user for user in users_info.get('users', []) if user.get('user') == db_user), None)
    if existing_user is None:
        print(f"user {db_user} for db {database} does not yet exist")
        client[database].command('createUser', db_user, pwd=db_password, roles=["readWrite"])
        print(f"created user {db_user} for db {database}")
    else:
        print(f"user {db_user} for db {database} already exists")
