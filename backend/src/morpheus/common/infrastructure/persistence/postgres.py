from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


class BaseModel(DeclarativeBase):
    pass


class PostgresRepository:
    def __init__(self, configuration):
        connection_string = "postgresql+psycopg2://{}:{}@{}:{}/{}".format(
            configuration.POSTGRES_USER,
            configuration.POSTGRES_PASSWORD,
            configuration.POSTGRES_HOST,
            configuration.POSTGRES_PORT,
            configuration.POSTGRES_DB,
        )

        self.session = sessionmaker(create_engine(connection_string))

