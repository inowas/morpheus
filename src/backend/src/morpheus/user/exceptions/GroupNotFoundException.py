from morpheus.common.types.identity.Identity import GroupId


class GroupNotFoundException(Exception):
    def __init__(self, group_id: GroupId):
        super().__init__(f'Group with id {group_id.to_str()} not found')
