from morpheus.common.api.Pydantic import BaseModel
from morpheus.user.application.read.UserReader import user_reader
from morpheus.user.incoming import get_identity


class GetCurrentUserResponse(BaseModel):
    user_id: str
    is_admin: bool
    email: str
    username: str
    first_name: str | None = None
    last_name: str | None = None


class GetCurrentUserRequestHandler:
    @staticmethod
    def handle() -> tuple[GetCurrentUserResponse, int]:
        identity = get_identity()
        if identity is None:
            raise Exception('User not authenticated')

        user = user_reader.get_user_by_id(identity.user_id)
        if user is None:
            raise Exception('User not found')

        return GetCurrentUserResponse(
            user_id=user.user_id.to_str(),
            is_admin=user.is_admin,
            email=user.user_data.email.to_str(),
            username=user.user_data.username.to_str(),
            first_name=user.user_data.first_name.to_str() if user.user_data.first_name is not None else None,
            last_name=user.user_data.last_name.to_str() if user.user_data.last_name is not None else None,
        ), 200
