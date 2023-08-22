from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import sessionmaker, DeclarativeBase

db = SQLAlchemy()


class BaseModel(DeclarativeBase):
    pass


class BaseRepository:
    def __init__(self, engine):
        self.session = sessionmaker(engine)
