from unittest.mock import patch

import pytest

from morpheus.common.types.identity.Identity import GroupId, UserId
from morpheus.user.exceptions.GroupNotFoundException import GroupNotFoundException
from morpheus.user.exceptions.InsufficientPermissionsException import InsufficientPermissionsException
from morpheus.user.exceptions.UnauthorizedException import UnauthorizedException
from morpheus.user.presentation.api.write.AddMembersToGroupRequestHandler import AddMembersToGroupRequest, AddMembersToGroupRequestHandler

pytestmark = [pytest.mark.unit]


def _make_identity_dict(user_id: str = 'user-1', is_admin: bool = False) -> dict:
    return {'user_id': user_id, 'group_ids': [], 'is_admin': is_admin}


class TestAddMembersToGroupRequest:
    def test_valid_request(self):
        request = AddMembersToGroupRequest(member_ids=['user-1', 'user-2'])
        assert request.member_ids == ['user-1', 'user-2']

    def test_empty_member_ids(self):
        request = AddMembersToGroupRequest(member_ids=[])
        assert request.member_ids == []

    def test_from_dict(self):
        request = AddMembersToGroupRequest(**{'member_ids': ['user-1']})
        assert request.member_ids == ['user-1']


class TestAddMembersToGroupRequestHandler:
    @patch('morpheus.user.presentation.api.write.AddMembersToGroupRequestHandler.get_identity')
    def test_raises_unauthorized_when_identity_is_none(self, mock_get_identity):
        mock_get_identity.return_value = None
        group_id = GroupId.from_str('group-1')

        with pytest.raises(UnauthorizedException):
            AddMembersToGroupRequestHandler.handle(
                group_id=group_id,
                request=AddMembersToGroupRequest(member_ids=['user-2']),
            )

    @patch('morpheus.user.presentation.api.write.AddMembersToGroupRequestHandler.get_identity')
    def test_raises_insufficient_permissions_when_not_admin(self, mock_get_identity):
        mock_get_identity.return_value = _make_identity_dict(is_admin=False)
        group_id = GroupId.from_str('group-1')

        with pytest.raises(InsufficientPermissionsException):
            AddMembersToGroupRequestHandler.handle(
                group_id=group_id,
                request=AddMembersToGroupRequest(member_ids=['user-2']),
            )

    @patch('morpheus.user.presentation.api.write.AddMembersToGroupRequestHandler.AddMembersToGroupCommandHandler')
    @patch('morpheus.user.presentation.api.write.AddMembersToGroupRequestHandler.get_identity')
    def test_dispatches_command_when_admin(self, mock_get_identity, mock_handler):
        mock_get_identity.return_value = _make_identity_dict(user_id='admin-1', is_admin=True)
        group_id = GroupId.from_str('group-1')

        AddMembersToGroupRequestHandler.handle(
            group_id=group_id,
            request=AddMembersToGroupRequest(member_ids=['user-2', 'user-3']),
        )

        mock_handler.handle.assert_called_once()
        command = mock_handler.handle.call_args[0][0]
        assert command.group_id == group_id
        assert command.members == {UserId.from_str('user-2'), UserId.from_str('user-3')}
        assert command.creator_id == UserId.from_str('admin-1')

    @patch('morpheus.user.presentation.api.write.AddMembersToGroupRequestHandler.AddMembersToGroupCommandHandler')
    @patch('morpheus.user.presentation.api.write.AddMembersToGroupRequestHandler.get_identity')
    def test_dispatches_command_with_empty_members(self, mock_get_identity, mock_handler):
        mock_get_identity.return_value = _make_identity_dict(is_admin=True)
        group_id = GroupId.from_str('group-1')

        AddMembersToGroupRequestHandler.handle(
            group_id=group_id,
            request=AddMembersToGroupRequest(member_ids=[]),
        )

        command = mock_handler.handle.call_args[0][0]
        assert command.members == set()

    @patch('morpheus.user.presentation.api.write.AddMembersToGroupRequestHandler.AddMembersToGroupCommandHandler')
    @patch('morpheus.user.presentation.api.write.AddMembersToGroupRequestHandler.get_identity')
    def test_raises_group_not_found_when_handler_raises(self, mock_get_identity, mock_handler):
        mock_get_identity.return_value = _make_identity_dict(is_admin=True)
        group_id = GroupId.from_str('nonexistent-group')
        mock_handler.handle.side_effect = GroupNotFoundException(group_id)

        with pytest.raises(GroupNotFoundException):
            AddMembersToGroupRequestHandler.handle(
                group_id=group_id,
                request=AddMembersToGroupRequest(member_ids=['user-2']),
            )
