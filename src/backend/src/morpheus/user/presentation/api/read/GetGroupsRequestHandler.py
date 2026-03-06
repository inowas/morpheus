from pydantic import BaseModel, Field

from morpheus.user.application.read.GroupReader import group_reader
from morpheus.user.exceptions.InsufficientPermissionsException import InsufficientPermissionsException
from morpheus.user.exceptions.UnauthorizedException import UnauthorizedException
from morpheus.user.incoming import get_identity


class GroupResponseItem(BaseModel):
    group_id: str = Field(..., examples=['123e4567-e89b-12d3-a456-426614174000'])
    group_name: str = Field(..., examples=['Admins'])
    members: list[str] = Field(..., examples=[['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001']])
    admins: list[str] = Field(..., examples=[['123e4567-e89b-12d3-a456-426614174000']])


GetGroupsResponse = list[dict]


class GetGroupsRequestHandler:
    @staticmethod
    def handle() -> GetGroupsResponse:
        identity = get_identity()
        if identity is None:
            raise UnauthorizedException()

        if not identity.is_admin:
            raise InsufficientPermissionsException()

        groups = group_reader.get_all_groups()

        result = []
        for group in groups:
            result.append(
                GroupResponseItem(
                    group_id=group.group_id.to_str(),
                    group_name=group.group_name.to_str(),
                    members=[member.to_str() for member in group.members],
                    admins=[admin.to_str() for admin in group.admins],
                )
            )

        return [group_response_item.dict() for group_response_item in result]
