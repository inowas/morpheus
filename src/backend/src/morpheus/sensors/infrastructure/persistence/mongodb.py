from morpheus.common.infrastructure.persistence.mongodb import get_database_client
from morpheus.settings import settings

database = get_database_client(settings.MONGO_SENSOR_DATABASE)
