from keycloak import KeycloakOpenID

from morpheus.authentication.types.KeycloakUserData import KeycloakUserData
from morpheus.settings import settings


def parse_user_data_from_token(token: str) -> KeycloakUserData | None:
    keycloak_openid = KeycloakOpenID(
        server_url=settings.KEYCLOAK_SERVER_URL, client_id=settings.KEYCLOAK_CLIENT_ID, client_secret_key=settings.KEYCLOAK_CLIENT_SECRET, realm_name=settings.KEYCLOAK_REALM
    )

    token_info = keycloak_openid.introspect(token)
    if token_info.get('active') is not True:
        return None

    user_id: str | None = token_info.get('sub', None)
    username: str | None = token_info.get('preferred_username', None)
    email: str | None = token_info.get('email', None)

    if user_id is None or username is None or email is None:
        return None

    realm_access = token_info.get('realm_access', {})
    roles = []
    if isinstance(realm_access, dict):
        roles = realm_access.get('roles', [])
    if not isinstance(roles, list):
        roles = []

    return KeycloakUserData(
        user_id=user_id, username=username, email=email, first_name=token_info.get('given_name', None), last_name=token_info.get('family_name', None), roles=roles
    )
