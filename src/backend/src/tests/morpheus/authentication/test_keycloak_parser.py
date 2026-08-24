from morpheus.authentication.infrastructure.keycloak_openid_provider import parse_user_data_from_token


class DummyOpenID:
    def __init__(self, token_info):
        self._token_info = token_info

    def introspect(self, token: str):
        return self._token_info


def test_inactive_token(monkeypatch):
    dummy = DummyOpenID({'active': False})
    monkeypatch.setattr('morpheus.authentication.infrastructure.keycloak_openid_provider.KeycloakOpenID', lambda *args, **kwargs: dummy)
    assert parse_user_data_from_token('dummy') is None


def test_active_token_returns_user(monkeypatch):
    token_info = {
        'active': True,
        'sub': 'user-123',
        'preferred_username': 'jdoe',
        'email': 'jdoe@example.com',
        'given_name': 'John',
        'family_name': 'Doe',
        'realm_access': {'roles': ['role1', 'role2']},
    }
    dummy = DummyOpenID(token_info)
    monkeypatch.setattr('morpheus.authentication.infrastructure.keycloak_openid_provider.KeycloakOpenID', lambda *args, **kwargs: dummy)
    user = parse_user_data_from_token('dummy')
    assert user is not None
    assert user.user_id == 'user-123'
    assert user.username == 'jdoe'
    assert user.email == 'jdoe@example.com'
    assert user.first_name == 'John'
    assert user.last_name == 'Doe'
    assert user.roles == ['role1', 'role2']
