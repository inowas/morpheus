from . import UserEvents

event_list = [
    UserEvents.UserCreatedEvent,
    UserEvents.UserDataUpdatedEvent,
    UserEvents.UserLinkedToKeycloakEvent,
    UserEvents.UserLinkedToGeonodeEvent,
    UserEvents.UserPromotedToAdminEvent,
    UserEvents.UserDemotedFromAdminEvent,
]

def get_user_event_list():
    return event_list
