from typing import Callable
from morpheus.authentication.outgoing import require_logged_in_user

def require_datahub_user(route_handler: Callable):
    @require_logged_in_user
    def wrapper():
        return route_handler()

    return wrapper
