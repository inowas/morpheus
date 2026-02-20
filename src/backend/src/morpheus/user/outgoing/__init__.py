from morpheus.user.application.read.UserReader import user_reader
from morpheus.user.application.write.CreateOrUpdateUserFromKeycloak import CreateOrUpdateUserFromKeycloakCommand, CreateOrUpdateUserFromKeycloakCommandHandler
from morpheus.user.types.User import KeycloakUserId, UserEmail, UserFirstName, UserLastName, Username


def create_or_update_user_from_keycloak(keycloak_user_id: str, is_admin: bool, email: str, username: str, first_name: str | None, last_name: str | None) -> None:
    if is_admin is True:
        CreateOrUpdateUserFromKeycloakCommandHandler.handle(
            CreateOrUpdateUserFromKeycloakCommand.as_admin_user(
                keycloak_user_id=KeycloakUserId.from_str(keycloak_user_id),
                email=UserEmail.from_str(email),
                username=Username.from_str(username),
                first_name=UserFirstName.try_from_str(first_name),
                last_name=UserLastName.try_from_str(last_name),
            )
        )
        return

    CreateOrUpdateUserFromKeycloakCommandHandler.handle(
        CreateOrUpdateUserFromKeycloakCommand.as_normal_user(
            keycloak_user_id=KeycloakUserId.from_str(keycloak_user_id),
            email=UserEmail.from_str(email),
            username=Username.from_str(username),
            first_name=UserFirstName.try_from_str(first_name),
            last_name=UserLastName.try_from_str(last_name),
        )
    )
    return


def get_identity_by_keycloak_id(keycloak_user_id: str) -> dict | None:
    user = user_reader.get_user_linked_to_keycloak(KeycloakUserId.from_str(keycloak_user_id))
    if user is None:
        return None

    return {
        'user_id': user.user_id.to_str(),
        'group_ids': [],
        'is_admin': user.is_admin,
    }
