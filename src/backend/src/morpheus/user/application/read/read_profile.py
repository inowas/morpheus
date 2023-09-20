from morpheus.user.incoming import get_authenticated_user_id
from morpheus.user.infrastructure.persistence.user import UserRepository
from morpheus.user.types.user_profile import UserProfile


class NotAuthenticatedError(Exception):
    pass


class ReadAuthenticatedUserProfileQueryHandler:
    def __init__(self, repository: UserRepository) -> None:
        self._repository = repository

    def handle(self) -> UserProfile:
        user_id = get_authenticated_user_id()
        if user_id is None:
            raise NotAuthenticatedError('User is not authenticated')

        user = self._repository.fetch_by_id(user_id)
        if user is None:
            raise ValueError('User not found')

        return UserProfile(email=user.email)
