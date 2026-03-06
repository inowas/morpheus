from unittest.mock import patch

import pytest

from morpheus.common.types.identity.Identity import Identity, UserId
from morpheus.user.exceptions.UnauthorizedException import UnauthorizedException
from morpheus.user.presentation.api.read.GetUsersRequestHandler import GetUsersRequestHandler, UserResponseItem
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


class TestGetUsersRequestHandler:
    @patch('morpheus.user.presentation.api.read.GetUsersRequestHandler.get_identity')
    def test_raises_unauthorized_when_identity_is_none(self, mock_get_identity):
        mock_get_identity.return_value = None

        with pytest.raises(UnauthorizedException):
            GetUsersRequestHandler.handle()

    @patch('morpheus.user.presentation.api.read.GetUsersRequestHandler.user_reader')
    @patch('morpheus.user.presentation.api.read.GetUsersRequestHandler.get_identity')
    def test_returns_empty_list_when_no_users(self, mock_get_identity, mock_user_reader):
        mock_get_identity.return_value = _make_identity()
        mock_user_reader.get_all_users.return_value = []

        result = GetUsersRequestHandler.handle()

        assert result == []

    @patch('morpheus.user.presentation.api.read.GetUsersRequestHandler.user_reader')
    @patch('morpheus.user.presentation.api.read.GetUsersRequestHandler.get_identity')
    def test_returns_users_with_all_fields(self, mock_get_identity, mock_user_reader):
        mock_get_identity.return_value = _make_identity()
        mock_user_reader.get_all_users.return_value = [
            _make_user('user-1', 'admin@example.com', 'admin', is_admin=True, first_name='Admin', last_name='User'),
            _make_user('user-2', 'dev@example.com', 'dev', is_admin=False, first_name='Dev', last_name='User'),
        ]

        result = GetUsersRequestHandler.handle()

        assert len(result) == 2
        assert result[0].user_id == 'user-1'
        assert result[0].email == 'admin@example.com'
        assert result[0].username == 'admin'
        assert result[0].is_admin is True
        assert result[0].first_name == 'Admin'
        assert result[0].last_name == 'User'
        assert result[1].user_id == 'user-2'
        assert result[1].is_admin is False

    @patch('morpheus.user.presentation.api.read.GetUsersRequestHandler.user_reader')
    @patch('morpheus.user.presentation.api.read.GetUsersRequestHandler.get_identity')
    def test_returns_none_for_missing_name_fields(self, mock_get_identity, mock_user_reader):
        mock_get_identity.return_value = _make_identity()
        mock_user_reader.get_all_users.return_value = [
            _make_user('user-1', 'user@example.com', 'user'),
        ]

        result = GetUsersRequestHandler.handle()

        assert len(result) == 1
        assert result[0].first_name is None
        assert result[0].last_name is None

    @patch('morpheus.user.presentation.api.read.GetUsersRequestHandler.user_reader')
    @patch('morpheus.user.presentation.api.read.GetUsersRequestHandler.get_identity')
    def test_returns_user_response_items(self, mock_get_identity, mock_user_reader):
        mock_get_identity.return_value = _make_identity()
        mock_user_reader.get_all_users.return_value = [
            _make_user('user-1', 'user@example.com', 'user', first_name='First', last_name='Last'),
        ]

        result = GetUsersRequestHandler.handle()

        assert isinstance(result[0], UserResponseItem)
