from morpheus.user.application.read.reader import QueryBus
from morpheus.user.application.read.read_profile import ReadAuthenticatedUserProfileQuery


class ReadUserProfileRequestHandler:

    def __init__(self, query_bus: QueryBus) -> None:
        self._query_bus = query_bus

    def handle(self):
        profile = self._query_bus.execute(ReadAuthenticatedUserProfileQuery())
        return {'email': profile.email}
