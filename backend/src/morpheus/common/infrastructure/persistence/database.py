from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

db = SQLAlchemy()


class BaseModel(DeclarativeBase):
    pass


class BaseRepository:
    def __init__(self, engine: Engine):
        self.session = sessionmaker(engine)
