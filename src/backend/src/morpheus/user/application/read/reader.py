from morpheus.common.infrastructure.persistence.postgresql import db
from morpheus.user.application.read.read_profile import ReadAuthenticatedUserProfileQueryHandler
from morpheus.user.infrastructure.persistence.user import UserRepository
from morpheus.user.types.user_profile import UserProfile

def read_authenticated_user_profile() -> UserProfile:
    handler = ReadAuthenticatedUserProfileQueryHandler(UserRepository(db.engine))
    return handler.handle()
