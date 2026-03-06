from unittest.mock import patch

import pytest

from morpheus.common.types.identity.Identity import UserId
from morpheus.user.exceptions.InsufficientPermissionsException import InsufficientPermissionsException
from morpheus.user.exceptions.UnauthorizedException import UnauthorizedException
from morpheus.user.presentation.api.write.CreateGroupRequestHandler import CreateGroupRequest, CreateGroupRequestHandler

pytestmark = [pytest.mark.unit]


def _make_identity_dict(user_id: str = 'user-1', is_admin: bool = False) -> dict:
    return {'user_id': user_id, 'group_ids': [], 'is_admin': is_admin}


class TestCreateGroupRequest:
    def test_valid_request(self):
        request = CreateGroupRequest(name='My Group')
        assert request.name == 'My Group'

    def test_from_dict(self):
        request = CreateGroupRequest(**{'name': 'My Group'})
        assert request.name == 'My Group'


class TestCreateGroupRequestHandler:
    @patch('morpheus.user.presentation.api.write.CreateGroupRequestHandler.get_identity')
    def test_raises_unauthorized_when_identity_is_none(self, mock_get_identity):
        mock_get_identity.return_value = None

        with pytest.raises(UnauthorizedException):
            CreateGroupRequestHandler.handle(request=CreateGroupRequest(name='Group'))

    @patch('morpheus.user.presentation.api.write.CreateGroupRequestHandler.get_identity')
    def test_raises_insufficient_permissions_when_not_admin(self, mock_get_identity):
        mock_get_identity.return_value = _make_identity_dict(is_admin=False)

        with pytest.raises(InsufficientPermissionsException):
            CreateGroupRequestHandler.handle(request=CreateGroupRequest(name='Group'))

    @patch('morpheus.user.presentation.api.write.CreateGroupRequestHandler.CreateGroupCommandHandler')
    @patch('morpheus.user.presentation.api.write.CreateGroupRequestHandler.get_identity')
    def test_dispatches_command_when_admin(self, mock_get_identity, mock_handler):
        mock_get_identity.return_value = _make_identity_dict(user_id='admin-1', is_admin=True)

        CreateGroupRequestHandler.handle(request=CreateGroupRequest(name='New Group'))

        mock_handler.handle.assert_called_once()
        command = mock_handler.handle.call_args[0][0]
        assert command.name.to_str() == 'New Group'
        assert command.creator_id == UserId.from_str('admin-1')

    @patch('morpheus.user.presentation.api.write.CreateGroupRequestHandler.CreateGroupCommandHandler')
    @patch('morpheus.user.presentation.api.write.CreateGroupRequestHandler.get_identity')
    def test_creates_group_with_new_id(self, mock_get_identity, mock_handler):
        mock_get_identity.return_value = _make_identity_dict(is_admin=True)

        CreateGroupRequestHandler.handle(request=CreateGroupRequest(name='Group'))

        command = mock_handler.handle.call_args[0][0]
        assert command.group_id is not None
        assert command.group_id.to_str() != ''
