from keycloak import KeycloakOpenID

from morpheus.settings import settings


def is_token_valid(token: str) -> bool:
    keycloak_openid = KeycloakOpenID(server_url="https://identity.inowas.localhost",
                                 client_id=settings.KEYCLOAK_CLIENT_ID,
                                 client_secret_key=settings.KEYCLOAK_CLIENT_SECRET,
                                 realm_name="inowas")

    token_info = keycloak_openid.introspect(token)
    if (not token_info.get('active') is True):
        return False

    return True
