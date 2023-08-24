import dataclasses
from morpheus.authentication.infrastructure.persistence.oauth2 import ClientRepository
from morpheus.authentication.types.oauth2 import PublicClient


@dataclasses.dataclass(frozen=True)
class CreatePublicClientCommand:
    name: str


class CreatePublicClientCommandHandler:
    def __init__(self, repository: ClientRepository) -> None:
        self._repository = repository

    def handle(self, command: CreatePublicClientCommand):
        public_client = PublicClient.new(command.name)
        self._repository.insert_public_client(public_client)
