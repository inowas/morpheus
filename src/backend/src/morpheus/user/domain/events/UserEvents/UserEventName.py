from enum import StrEnum


class UserEventName(StrEnum):
    USER_CREATED = 'User Created'
    USER_DATA_UPDATED = 'User Data Updated'
    USER_LINKED_TO_KEYCLOAK = 'User Linked to Keycloak'
    USER_LINKED_TO_GEO_NODE = 'User Linked to GeoNode'
    USER_PROMOTED_TO_ADMIN = 'User Promoted to Admin'
    USER_DEMOTED_FROM_ADMIN = 'User Demoted from Admin'

    def to_str(self):
        return self.value
