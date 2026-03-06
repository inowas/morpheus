from pydantic import BaseModel, Field

from morpheus.user.application.read.UserReader import user_reader
from morpheus.user.exceptions.UnauthorizedException import UnauthorizedException
from morpheus.user.exceptions.UserNotFoundException import UserNotFoundException
from morpheus.user.incoming import get_identity


class GetCurrentUserResponse(BaseModel):
    user_id: str = Field(..., examples=['123e4567-e89b-12d3-a456-426614174000'])
    is_admin: bool = Field(..., examples=[True])
    email: str = Field(..., examples=['user@example.com'])
    username: str = Field(..., examples=['user'])
    first_name: str | None = Field(..., examples=['User'])
    last_name: str | None = Field(..., examples=['Example'])


class GetCurrentUserRequestHandler:
    @staticmethod
    def handle() -> GetCurrentUserResponse:
        identity = get_identity()
        if identity is None:
            raise UnauthorizedException()

        user = user_reader.get_user_by_id(identity.user_id)
        if user is None:
            raise UserNotFoundException(user_id=identity.user_id)

        return GetCurrentUserResponse(
            user_id=user.user_id.to_str(),
            is_admin=user.is_admin,
            email=user.user_data.email.to_str(),
            username=user.user_data.username.to_str(),
            first_name=user.user_data.first_name.to_str() if user.user_data.first_name is not None else None,
            last_name=user.user_data.last_name.to_str() if user.user_data.last_name is not None else None,
        )
