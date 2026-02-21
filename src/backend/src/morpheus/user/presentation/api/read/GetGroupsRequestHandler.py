from morpheus.common.api.Pydantic import BaseModel
from morpheus.user.application.read.GroupReader import group_reader
from morpheus.user.incoming import get_identity


class GroupResponseItem(BaseModel):
    group_id: str
    group_name: str
    members: list[str]
    admins: list[str]


GetGroupsResponse = list[GroupResponseItem]


class GetGroupsRequestHandler:
    @staticmethod
    def handle():
        identity = get_identity()
        if identity is None:
            return '', 401

        if not identity.is_admin:
            return '', 403

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

        return [group_response_item.dict() for group_response_item in result], 200
