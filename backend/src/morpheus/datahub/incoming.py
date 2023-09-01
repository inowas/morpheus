import morpheus.authentication.outgoing as from_authentication_module
from morpheus.user.application.read.query_bus import user_query_bus
from morpheus.user.application.read.user import ReadUserQuery
from morpheus.user.types.user import UserId, User

require_authentication = from_authentication_module.require_authentication
