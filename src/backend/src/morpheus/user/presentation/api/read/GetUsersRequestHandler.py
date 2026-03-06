from pydantic import BaseModel, Field

from morpheus.user.application.read.UserReader import user_reader
from morpheus.user.exceptions.UnauthorizedException import UnauthorizedException
from morpheus.user.incoming import get_identity


class UserResponseItem(BaseModel):
    user_id: str = Field(..., examples=['123e4567-e89b-12d3-a456-426614174000'])
    is_admin: bool = Field(..., examples=[True])
    email: str = Field(..., examples=['admin@example.com'])
    username: str = Field(..., examples=['admin'])
    first_name: str | None = Field(..., examples=['Admin'])
    last_name: str | None = Field(..., examples=['User'])


UserResponse = list[UserResponseItem]


class GetUsersRequestHandler:
    @staticmethod
    def handle() -> UserResponse:
        identity = get_identity()
        if identity is None:
            raise UnauthorizedException()

        users = user_reader.get_all_users()
        response = [
            UserResponseItem(
                user_id=user.user_id.to_str(),
                is_admin=user.is_admin,
                email=user.user_data.email.to_str(),
                username=user.user_data.username.to_str(),
                first_name=user.user_data.first_name.to_str() if user.user_data.first_name is not None else None,
                last_name=user.user_data.last_name.to_str() if user.user_data.last_name is not None else None,
            )
            for user in users
        ]

        return response
