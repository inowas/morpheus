from unittest.mock import patch

import pytest

from morpheus.common.types.identity.Identity import Identity, UserId
from morpheus.user.exceptions.UnauthorizedException import UnauthorizedException
from morpheus.user.exceptions.UserNotFoundException import UserNotFoundException
from morpheus.user.presentation.api.read.GetCurrentUserRequestHandler import GetCurrentUserRequestHandler, GetCurrentUserResponse
from morpheus.user.types.User import KeycloakUserId, User, UserData, UserEmail, UserFirstName, UserLastName, Username

pytestmark = [pytest.mark.unit]


def _make_user(user_id: str, email: str, username: str, is_admin: bool = False, first_name: str | None = None, last_name: str | None = None) -> User:
    return User(
        user_id=UserId.from_str(user_id),
        keycloak_user_id=KeycloakUserId.from_str(user_id),
        geo_node_user_id=None,
        is_admin=is_admin,
        user_data=UserData(
            email=UserEmail.from_str(email),
            username=Username.from_str(username),
            first_name=UserFirstName.from_str(first_name) if first_name else None,
            last_name=UserLastName.from_str(last_name) if last_name else None,
        ),
    )


def _make_identity(user_id: str = 'user-1', is_admin: bool = False) -> Identity:
    return Identity(user_id=UserId.from_str(user_id), group_ids=[], is_admin=is_admin)


class TestGetCurrentUserRequestHandler:
    @patch('morpheus.user.presentation.api.read.GetCurrentUserRequestHandler.get_identity')
    def test_raises_unauthorized_when_identity_is_none(self, mock_get_identity):
        mock_get_identity.return_value = None

        with pytest.raises(UnauthorizedException):
            GetCurrentUserRequestHandler.handle()

    @patch('morpheus.user.presentation.api.read.GetCurrentUserRequestHandler.user_reader')
    @patch('morpheus.user.presentation.api.read.GetCurrentUserRequestHandler.get_identity')
    def test_raises_user_not_found_when_user_does_not_exist(self, mock_get_identity, mock_user_reader):
        mock_get_identity.return_value = _make_identity('user-1')
        mock_user_reader.get_user_by_id.return_value = None

        with pytest.raises(UserNotFoundException):
            GetCurrentUserRequestHandler.handle()

    @patch('morpheus.user.presentation.api.read.GetCurrentUserRequestHandler.user_reader')
    @patch('morpheus.user.presentation.api.read.GetCurrentUserRequestHandler.get_identity')
    def test_returns_current_user_with_all_fields(self, mock_get_identity, mock_user_reader):
        mock_get_identity.return_value = _make_identity('user-1')
        mock_user_reader.get_user_by_id.return_value = _make_user('user-1', 'admin@example.com', 'admin', is_admin=True, first_name='Admin', last_name='User')

        result = GetCurrentUserRequestHandler.handle()

        assert isinstance(result, GetCurrentUserResponse)
        assert result.user_id == 'user-1'
        assert result.email == 'admin@example.com'
        assert result.username == 'admin'
        assert result.is_admin is True
        assert result.first_name == 'Admin'
        assert result.last_name == 'User'

    @patch('morpheus.user.presentation.api.read.GetCurrentUserRequestHandler.user_reader')
    @patch('morpheus.user.presentation.api.read.GetCurrentUserRequestHandler.get_identity')
    def test_returns_none_for_missing_name_fields(self, mock_get_identity, mock_user_reader):
        mock_get_identity.return_value = _make_identity('user-1')
        mock_user_reader.get_user_by_id.return_value = _make_user('user-1', 'user@example.com', 'user')

        result = GetCurrentUserRequestHandler.handle()

        assert result.first_name is None
        assert result.last_name is None

    @patch('morpheus.user.presentation.api.read.GetCurrentUserRequestHandler.user_reader')
    @patch('morpheus.user.presentation.api.read.GetCurrentUserRequestHandler.get_identity')
    def test_looks_up_user_by_identity_user_id(self, mock_get_identity, mock_user_reader):
        identity = _make_identity('user-42')
        mock_get_identity.return_value = identity
        mock_user_reader.get_user_by_id.return_value = _make_user('user-42', 'u@example.com', 'u')

        GetCurrentUserRequestHandler.handle()

        mock_user_reader.get_user_by_id.assert_called_once_with(identity.user_id)
