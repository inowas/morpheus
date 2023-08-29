from morpheus.user.incoming import get_authenticated_user


class ReadUserProfileRequestHandler:
    def handle(self):
        user = get_authenticated_user()
        return {'email': user.email}
