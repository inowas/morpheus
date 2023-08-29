import uuid

from morpheus.authentication.infrastructure.oauth2.server import require_oauth, authenticated_oauth_user_id

require_authentication = require_oauth


def get_authenticated_user_id() -> uuid.UUID | None:
    return authenticated_oauth_user_id()
