from unittest.mock import MagicMock

import pytest

from morpheus.common.types.identity.Identity import GroupId, UserId
from morpheus.user.application.read.GroupReader import GroupReader
from morpheus.user.types.Group import Group, GroupName

pytestmark = [pytest.mark.unit]


def _group(group_id: str, member_ids: list[str], admin_ids: list[str]) -> Group:
    return Group(
        group_id=GroupId.from_str(group_id),
        group_name=GroupName.from_str(group_id),
        members={UserId.from_str(member) for member in member_ids},
        admins={UserId.from_str(admin) for admin in admin_ids},
    )


class TestGetGroupsForUser:
    def test_returns_groups_user_is_member_or_admin_of(self):
        user_id = UserId.from_str('user-1')
        repository = MagicMock()
        repository.find_all_groups.return_value = [
            _group('group-1', member_ids=['user-1'], admin_ids=[]),
            _group('group-2', member_ids=[], admin_ids=['user-1']),
            _group('group-3', member_ids=['user-2'], admin_ids=[]),
        ]
        reader = GroupReader(repository)

        group_ids = reader.get_groups_for_user(user_id)

        assert group_ids == [GroupId.from_str('group-1'), GroupId.from_str('group-2')]

    def test_returns_empty_when_not_part_of_any_group(self):
        repository = MagicMock()
        repository.find_all_groups.return_value = [_group('group-1', member_ids=['other'], admin_ids=[])]
        reader = GroupReader(repository)

        assert reader.get_groups_for_user(UserId.from_str('user-1')) == []
