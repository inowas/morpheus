from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from morpheus.settings import settings


class BaseModel(DeclarativeBase):
    pass


class PostgresRepository:
    def __init__(self, engine):
        self.session = sessionmaker(engine)


engine = create_engine(
    "postgresql+psycopg2://{}:{}@{}:{}/{}".format(
        settings.POSTGRES_USER,
        settings.POSTGRES_PASSWORD,
        settings.POSTGRES_HOST,
        settings.POSTGRES_PORT,
        settings.POSTGRES_DB,
    )
)
