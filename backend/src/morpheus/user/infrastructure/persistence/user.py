import uuid
from sqlalchemy import select, String
from sqlalchemy.orm import Mapped, mapped_column

from morpheus.common.infrastructure.persistence.database import db, BaseRepository, BaseModel
from morpheus.user.types.user import User, UserId


class UserModel(BaseModel):
    __tablename__ = 'user'

    id: Mapped[str] = mapped_column(String, primary_key=True)
    email: Mapped[str] = mapped_column(String(255))
    password_hash: Mapped[str] = mapped_column(String(255))

    def to_user_type(self):
        return User(id=UserId(uuid.UUID(self.id)), email=self.email, password_hash=self.password_hash)

    @classmethod
    def from_user_type(cls, user: User):
        return cls(id=user.id, email=user.email, password_hash=user.password_hash)


class UserRepository(BaseRepository):

    def user_with_email_exists(self, email: str) -> bool:
        with self.session() as session:
            count = session.query(UserModel).filter_by(email=email).count()
            if count > 0:
                return True

            return False

    def fetch_by_id(self, user_id: UserId) -> User | None:
        with self.session() as session:
            statement = select(UserModel).filter_by(id=user_id)
            user = session.scalars(statement).one_or_none()
            if user is None:
                return None

            return user.to_user_type()

    def insert(self, user: User):
        with self.session() as session:
            session.add(UserModel.from_user_type(user))
            session.commit()
