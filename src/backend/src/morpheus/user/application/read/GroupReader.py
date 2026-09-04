from morpheus.common.types.identity.Identity import GroupId, UserId
from morpheus.user.infrastructure.persistence.GroupRepository import GroupRepository, group_repository
from morpheus.user.types.Group import Group


class GroupReader:
    def __init__(self, group_repository: GroupRepository):
        self.group_repository = group_repository

    def get_all_groups(self) -> list[Group]:
        return self.group_repository.find_all_groups()

    def get_group(self, group_id: GroupId) -> Group | None:
        return self.group_repository.find_group_by_id(group_id)

    def get_groups_for_user(self, user_id: UserId) -> list[GroupId]:
        return [
            group.group_id
            for group in self.group_repository.find_all_groups()
            if user_id in group.members or user_id in group.admins
        ]


group_reader = GroupReader(group_repository)
