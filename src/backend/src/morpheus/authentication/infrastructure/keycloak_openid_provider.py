from keycloak import KeycloakOpenID

from morpheus.settings import settings


def get_user_id_from_token(token: str) -> str | None:
    keycloak_openid = KeycloakOpenID(server_url=settings.KEYCLOAK_SERVER_URL,
                                     client_id=settings.KEYCLOAK_CLIENT_ID,
                                     client_secret_key=settings.KEYCLOAK_CLIENT_SECRET,
                                     realm_name=settings.KEYCLOAK_REALM)

    token_info = keycloak_openid.introspect(token)
    if not token_info.get('active') is True:
        return None

    return token_info.get('sub', None)
