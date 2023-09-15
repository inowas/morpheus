from morpheus.common.infrastructure.persistence.mongodb import get_database_client

DB_NAME = 'sensor_data'
database = get_database_client(DB_NAME)
