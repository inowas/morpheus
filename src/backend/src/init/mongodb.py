import os

from pymongo import MongoClient

print('creating users for mongodb')

host = os.environ.get('BACKEND_MONGO_HOST')
port = int(os.environ.get('BACKEND_MONGO_PORT'))
root_user = os.environ.get('BACKEND_MONGO_INITDB_ROOT_USERNAME')
root_password = os.environ.get('BACKEND_MONGO_INITDB_ROOT_PASSWORD')
db_user = os.environ.get('BACKEND_MONGO_USER')
db_password = os.environ.get('BACKEND_MONGO_PASSWORD')
databases = [os.environ.get('BACKEND_MONGO_SENSOR_DATABASE')]

client = MongoClient(host=host, port=port, username=root_user, password=root_password)

for database in databases:
    users_info = client[database].command('usersInfo')
    existing_user = next((user for user in users_info.get('users', []) if user.get('user') == db_user), None)
    if existing_user is None:
        print(f"user {db_user} for db {database} does not yet exist")
        client[database].command('createUser', db_user, pwd=db_password, roles=["readWrite"])
        print(f"created user {db_user} for db {database}")
    else:
        print(f"user {db_user} for db {database} already exists")
