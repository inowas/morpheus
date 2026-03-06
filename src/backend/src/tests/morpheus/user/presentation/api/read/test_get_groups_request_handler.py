from unittest.mock import patch

import pytest

from morpheus.common.types.identity.Identity import GroupId, Identity, UserId
from morpheus.user.exceptions.InsufficientPermissionsException import InsufficientPermissionsException
from morpheus.user.exceptions.UnauthorizedException import UnauthorizedException
from morpheus.user.presentation.api.read.GetGroupsRequestHandler import GetGroupsRequestHandler
from morpheus.user.types.Group import Group, GroupName

pytestmark = [pytest.mark.unit]


def _make_group(group_id: str, name: str, member_ids: list[str] | None = None, admin_ids: list[str] | None = None) -> Group:
    return Group(
        group_id=GroupId.from_str(group_id),
        group_name=GroupName.from_str(name),
        members={UserId.from_str(m) for m in (member_ids or [])},
        admins={UserId.from_str(a) for a in (admin_ids or [])},
    )


def _make_identity(user_id: str = 'user-1', is_admin: bool = False) -> Identity:
    return Identity(user_id=UserId.from_str(user_id), group_ids=[], is_admin=is_admin)


class TestGetGroupsRequestHandler:
    @patch('morpheus.user.presentation.api.read.GetGroupsRequestHandler.get_identity')
    def test_raises_unauthorized_when_identity_is_none(self, mock_get_identity):
        mock_get_identity.return_value = None

        with pytest.raises(UnauthorizedException):
            GetGroupsRequestHandler.handle()

    @patch('morpheus.user.presentation.api.read.GetGroupsRequestHandler.get_identity')
    def test_raises_insufficient_permissions_when_not_admin(self, mock_get_identity):
        mock_get_identity.return_value = _make_identity(is_admin=False)

        with pytest.raises(InsufficientPermissionsException):
            GetGroupsRequestHandler.handle()

    @patch('morpheus.user.presentation.api.read.GetGroupsRequestHandler.group_reader')
    @patch('morpheus.user.presentation.api.read.GetGroupsRequestHandler.get_identity')
    def test_returns_empty_list_when_no_groups(self, mock_get_identity, mock_group_reader):
        mock_get_identity.return_value = _make_identity(is_admin=True)
        mock_group_reader.get_all_groups.return_value = []

        result = GetGroupsRequestHandler.handle()

        assert result == []

    @patch('morpheus.user.presentation.api.read.GetGroupsRequestHandler.group_reader')
    @patch('morpheus.user.presentation.api.read.GetGroupsRequestHandler.get_identity')
    def test_returns_groups_with_members_and_admins(self, mock_get_identity, mock_group_reader):
        mock_get_identity.return_value = _make_identity(is_admin=True)
        mock_group_reader.get_all_groups.return_value = [
            _make_group('group-1', 'Admins', member_ids=['user-1', 'user-2'], admin_ids=['user-1']),
        ]

        result = GetGroupsRequestHandler.handle()

        assert len(result) == 1
        assert result[0]['group_id'] == 'group-1'
        assert result[0]['group_name'] == 'Admins'
        assert set(result[0]['members']) == {'user-1', 'user-2'}
        assert result[0]['admins'] == ['user-1']

    @patch('morpheus.user.presentation.api.read.GetGroupsRequestHandler.group_reader')
    @patch('morpheus.user.presentation.api.read.GetGroupsRequestHandler.get_identity')
    def test_returns_multiple_groups(self, mock_get_identity, mock_group_reader):
        mock_get_identity.return_value = _make_identity(is_admin=True)
        mock_group_reader.get_all_groups.return_value = [
            _make_group('group-1', 'Admins'),
            _make_group('group-2', 'Editors'),
        ]

        result = GetGroupsRequestHandler.handle()

        assert len(result) == 2

    @patch('morpheus.user.presentation.api.read.GetGroupsRequestHandler.group_reader')
    @patch('morpheus.user.presentation.api.read.GetGroupsRequestHandler.get_identity')
    def test_returns_group_with_empty_members(self, mock_get_identity, mock_group_reader):
        mock_get_identity.return_value = _make_identity(is_admin=True)
        mock_group_reader.get_all_groups.return_value = [
            _make_group('group-1', 'Empty Group'),
        ]

        result = GetGroupsRequestHandler.handle()

        assert result[0]['members'] == []
        assert result[0]['admins'] == []
