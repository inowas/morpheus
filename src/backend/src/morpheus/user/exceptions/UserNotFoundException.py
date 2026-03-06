from morpheus.common.types.identity.Identity import UserId


class UserNotFoundException(Exception):
    def __init__(self, user_id: UserId):
        super().__init__(f'User with id {user_id.to_str()} not found')
