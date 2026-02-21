from morpheus.common.api.Pydantic import BaseModel
from morpheus.user.application.read.UserReader import user_reader
from morpheus.user.incoming import get_identity


class UserResponseItem(BaseModel):
    user_id: str
    is_admin: bool
    email: str
    username: str
    first_name: str | None = None
    last_name: str | None = None


UserResponse = list[UserResponseItem]


class GetUsersRequestHandler:
    @staticmethod
    def handle() -> tuple[UserResponse, int]:
        identity = get_identity()
        if identity is None:
            return [], 401

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

        return response, 200
