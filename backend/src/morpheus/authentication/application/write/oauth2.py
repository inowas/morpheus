import dataclasses
from morpheus.authentication.infrastructure.persistence.oauth2 import ClientRepository
from morpheus.authentication.types.oauth2 import PublicClient, ClientId


@dataclasses.dataclass(frozen=True)
class CreatePublicClientCommand:
    client_id: ClientId
    name: str


class CreatePublicClientCommandHandler:
    def __init__(self, repository: ClientRepository) -> None:
        self._repository = repository

    def handle(self, command: CreatePublicClientCommand):
        public_client = PublicClient(id=command.client_id, name=command.name)
        self._repository.insert_public_client(public_client)
