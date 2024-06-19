from morpheus.user.infrastructure.persistence.UserRepository import UserRepository, user_repository
from morpheus.user.types.User import KeycloakUserId, User


class UserReader:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def get_user_linked_to_keycloak(self, keycloak_user_id: KeycloakUserId) -> User | None:
        return self.user_repository.get_user_by_keycloak_id(keycloak_user_id)

    def get_all_users(self) -> list[User]:
        return self.user_repository.find_all_users()


user_reader = UserReader(user_repository)
