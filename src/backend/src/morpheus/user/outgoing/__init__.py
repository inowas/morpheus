from morpheus.user.application.write.CreateOrUpdateUserFromKeycloak import CreateOrUpdateUserFromKeycloakCommand, CreateOrUpdateUserFromKeycloakCommandHandler
from morpheus.user.types.User import KeycloakUserId, UserEmail, Username, UserFirstName, UserLastName


def create_or_update_user_from_keycloak(
    keycloak_user_id: str,
    is_admin: bool,
    email: str,
    username: str,
    first_name: str | None,
    last_name: str | None
) -> None:
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


