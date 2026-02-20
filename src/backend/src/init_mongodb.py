import os
import time

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

from morpheus.settings import settings


def read_env_var(name: str) -> str:
    value = os.environ.get(name)
    if value is None:
        raise Exception(f'Environment variable {name} not set')

    return value


def wait_for_mongodb(client: MongoClient, max_retries: int = 30, retry_interval: int = 2) -> bool:
    """Wait for MongoDB to be ready"""
    for attempt in range(max_retries):
        try:
            client.admin.command('ping')
            print(f'✓ MongoDB connected (attempt {attempt + 1})')
            return True
        except (ServerSelectionTimeoutError, ConnectionFailure) as e:
            if attempt < max_retries - 1:
                print(f'⏳ Waiting for MongoDB... ({attempt + 1}/{max_retries})')
                time.sleep(retry_interval)
            else:
                print(f'✗ Failed to connect to MongoDB after {max_retries} attempts: {e}')
                return False
    return False


print('creating users for mongodb')

host = settings.MONGO_HOST
port = settings.MONGO_PORT
root_user = read_env_var('BACKEND_MONGO_INITDB_ROOT_USERNAME')
root_password = read_env_var('BACKEND_MONGO_INITDB_ROOT_PASSWORD')
db_user = settings.MONGO_USER
db_password = settings.MONGO_PASSWORD
databases = [settings.MONGO_PROJECT_DATABASE, settings.MONGO_SENSOR_DATABASE, settings.MONGO_USER_DATABASE]

client = MongoClient(host=host, port=int(port), username=root_user, password=root_password)

# Wait for MongoDB to be ready before attempting operations
if not wait_for_mongodb(client):
    print('✗ MongoDB initialization failed - database not available')
    exit(1)

for database in databases:
    users_info = client[database].command('usersInfo')
    existing_user = next((user for user in users_info.get('users', []) if user.get('user') == db_user), None)
    if existing_user is None:
        print(f'user {db_user} for db {database} does not yet exist')
        client[database].command('createUser', db_user, pwd=db_password, roles=['readWrite'])
        print(f'created user {db_user} for db {database}')
    else:
        print(f'user {db_user} for db {database} already exists')

print('✓ MongoDB user initialization complete')
