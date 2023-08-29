import morpheus.authentication.outgoing as from_authentication_module
from morpheus.user.application.read.query_bus import user_query_bus
from morpheus.user.application.read.user import ReadUserQuery
from morpheus.user.types.user import UserId, User

require_authentication = from_authentication_module.require_authentication


class NotAuthenticatedError(Exception):
    pass


def get_authenticated_user() -> User:
    authenticated_user_id = from_authentication_module.get_authenticated_user_id()
    if authenticated_user_id is None:
        raise NotAuthenticatedError('No user is authenticated')

    user = user_query_bus.execute(ReadUserQuery(id=UserId(authenticated_user_id)))
    if user is None:
        raise NotAuthenticatedError('No user found for authenticated user id')

    return user
