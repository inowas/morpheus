import morpheus.authentication.outgoing as from_authentication_module
from morpheus.user.types.user import UserId

require_authentication = from_authentication_module.require_authentication


def get_authenticated_user_id() -> UserId | None:
    user_id = from_authentication_module.get_authenticated_user_id()
    if user_id is None:
        return None

    return UserId(user_id)
