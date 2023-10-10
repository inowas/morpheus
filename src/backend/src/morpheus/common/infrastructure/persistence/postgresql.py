from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from morpheus.settings import settings


def get_database_engine():
    connection_string = "postgresql+psycopg2://{}:{}@{}:{}/{}".format(
        settings.POSTGRES_USER,
        settings.POSTGRES_PASSWORD,
        settings.POSTGRES_HOST,
        settings.POSTGRES_PORT,
        settings.POSTGRES_DB,
    )
    return create_engine(connection_string)


class BaseModel(DeclarativeBase):
    pass


class BaseRepository:
    def __init__(self, engine: Engine):
        self.session = sessionmaker(engine)
