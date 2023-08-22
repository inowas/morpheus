from unittest.mock import patch
import pytest
from morpheus.user.application.create_user import CreateUserCommandHandler, CreateUserFailed, CreateUserCommand


@pytest.fixture
def user_repository():
    with patch('morpheus.user.infrastructure.persistence.user.UserRepository') as mock_repository_class:
        repository = mock_repository_class.return_value
        repository.user_with_email_exists.return_value = False
        yield repository


password_with_insufficient_strength = '123'
password_with_sufficient_strength = 'sjhdfg87342hiufewiug8ozq34edsfwaghuiz43qt'


def test_try_creating_user_with_empty_email(user_repository):
    with pytest.raises(CreateUserFailed) as exception_info:
        handler = CreateUserCommandHandler(user_repository)
        handler.handle(CreateUserCommand(email='', password=password_with_sufficient_strength))

    assert exception_info.value.get_error_code() == CreateUserFailed.EMAIL_EMPTY


def test_try_creating_user_with_empty_password(user_repository):
    with pytest.raises(CreateUserFailed) as exception_info:
        command = CreateUserCommandHandler(user_repository)
        command.handle(CreateUserCommand(email='test@inowas.com', password=''))

    assert exception_info.value.get_error_code() == CreateUserFailed.PASSWORD_EMPTY


def test_try_creating_user_with_existing_email(user_repository):
    with pytest.raises(CreateUserFailed) as exception_info:
        user_repository.user_with_email_exists.return_value = True

        command = CreateUserCommandHandler(user_repository)
        command.handle(CreateUserCommand(email='test@inowas.com', password=password_with_sufficient_strength))

    assert exception_info.value.get_error_code() == CreateUserFailed.EMAIL_EXISTS


def test_try_creating_user_with_insufficient_password(user_repository):
    with pytest.raises(CreateUserFailed) as exception_info:
        command = CreateUserCommandHandler(user_repository)
        command.handle(CreateUserCommand(email='test@inowas.com', password=password_with_insufficient_strength))

    assert exception_info.value.get_error_code() == CreateUserFailed.PASSWORD_STRENGTH_INSUFFICIENT


def test_create_user(user_repository):
    command = CreateUserCommandHandler(user_repository)
    command.handle(CreateUserCommand(email='test@inowas.com', password=password_with_sufficient_strength))

    user_repository.insert.assert_called_once()
