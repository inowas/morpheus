from morpheus.common.types.identity.Identity import GroupId
from morpheus.user.infrastructure.persistence.GroupRepository import GroupRepository, group_repository
from morpheus.user.types.Group import Group


class GroupReader:
    def __init__(self, group_repository: GroupRepository):
        self.group_repository = group_repository

    def get_all_groups(self) -> list[Group]:
        return self.group_repository.find_all_groups()

    def get_group(self, group_id: GroupId) -> Group | None:
        return self.group_repository.find_group_by_id(group_id)


group_reader = GroupReader(group_repository)
