from abc import ABC, abstractmethod
from sqlalchemy import select, Column, String, UUID
from morpheus.common.infrastructure.persistence.postgres import PostgresRepository, BaseModel
from morpheus.user.types.user import User, UserId


class UserRepository(ABC):
    @abstractmethod
    def fetch_by_id(self, user_id: UserId) -> User:
        pass

    @abstractmethod
    def insert(self, user: User):
        pass


class UserModel(BaseModel):
    __tablename__ = 'user'

    id = Column(UUID, primary_key=True)
    email = Column(String(255))
    password_hash = Column(String(255))

    def to_user_type(self):
        return User(id=self.id,email=self.email,password_hash=self.password_hash)

    @classmethod
    def from_user_type(cls, user: User):
        return cls(id=user.id, email=user.email,password_hash=user.password_hash)


class PostgresUserRepository(UserRepository, PostgresRepository):
    def fetch_by_id(self, user_id: UserId) -> User | None:
        with self.session() as session:
            statement = select(User).filter_by(id=user_id)
            user = session.scalars(statement).one_or_none()
            if user is None:
                return None

            return user.to_user_type()

    def insert(self, user: User):
        with self.session() as session:
            session.add(UserModel.from_user_type(user))
            session.commit()
