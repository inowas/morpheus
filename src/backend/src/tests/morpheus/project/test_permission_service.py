import pytest

from morpheus.common.types.identity.Identity import GroupId, Identity, UserId
from morpheus.project.domain.PermissionService import PermissionService
from morpheus.project.types.Permissions import GroupCollection, MemberCollection, Permissions, Role, Visibility
from morpheus.project.types.permissions.Privilege import Privilege

pytestmark = [pytest.mark.unit, pytest.mark.project]

USER = UserId.from_str('11111111-1111-1111-1111-111111111111')
OTHER = UserId.from_str('22222222-2222-2222-2222-222222222222')
GROUP = GroupId.from_str('33333333-3333-3333-3333-333333333333')
OTHER_GROUP = GroupId.from_str('44444444-4444-4444-4444-444444444444')


def _identity(user_id: UserId = USER, group_ids: list[GroupId] | None = None, is_admin: bool = False) -> Identity:
    return Identity(user_id=user_id, group_ids=group_ids or [], is_admin=is_admin)


def _permissions(members: dict[UserId, Role] | None = None, groups: dict[GroupId, Role] | None = None, owner: UserId = OTHER,
                 visibility: Visibility = Visibility.PRIVATE) -> Permissions:
    permissions = Permissions.new(owner_id=owner)
    permissions = permissions.with_updated_members(MemberCollection(members=members or {}))
    permissions = permissions.with_updated_groups(GroupCollection(groups=groups or {}))
    return permissions.with_updated_visibility(visibility)


class TestGetEffectiveRole:
    def test_explicit_member_role_takes_precedence_over_group_role(self):
        identity = _identity(group_ids=[GROUP])
        permissions = _permissions(members={USER: Role.VIEWER}, groups={GROUP: Role.EDITOR})

        assert PermissionService.get_effective_role(identity, permissions) == Role.VIEWER

    def test_best_group_role_is_used_when_no_member_role(self):
        identity = _identity(group_ids=[GROUP, OTHER_GROUP])
        permissions = _permissions(groups={GROUP: Role.VIEWER, OTHER_GROUP: Role.ADMIN})

        assert PermissionService.get_effective_role(identity, permissions) == Role.ADMIN

    def test_unrelated_groups_are_ignored(self):
        identity = _identity(group_ids=[OTHER_GROUP])
        permissions = _permissions(groups={GROUP: Role.EDITOR})

        assert PermissionService.get_effective_role(identity, permissions) is None

    def test_no_groups_returns_none(self):
        permissions = _permissions(groups={GROUP: Role.EDITOR})

        assert PermissionService.get_effective_role(_identity(), permissions) is None


class TestIdentityCan:
    def test_user_with_editor_role_through_group_can_edit(self):
        identity = _identity(group_ids=[GROUP])
        permissions = _permissions(groups={GROUP: Role.EDITOR})

        assert PermissionService.identity_can(Privilege.EDIT_PROJECT, identity, permissions) is True

    def test_user_with_viewer_role_through_group_cannot_edit(self):
        identity = _identity(group_ids=[GROUP])
        permissions = _permissions(groups={GROUP: Role.VIEWER})

        assert PermissionService.identity_can(Privilege.EDIT_PROJECT, identity, permissions) is False

    def test_user_with_admin_role_through_group_can_manage(self):
        identity = _identity(group_ids=[GROUP])
        permissions = _permissions(groups={GROUP: Role.ADMIN})

        assert PermissionService.identity_can(Privilege.MANAGE_PROJECT, identity, permissions) is True

    def test_user_with_editor_role_through_group_cannot_manage(self):
        identity = _identity(group_ids=[GROUP])
        permissions = _permissions(groups={GROUP: Role.EDITOR})

        assert PermissionService.identity_can(Privilege.MANAGE_PROJECT, identity, permissions) is False

    def test_public_project_is_visible_without_role(self):
        permissions = _permissions(visibility=Visibility.PUBLIC)

        assert PermissionService.identity_can(Privilege.VIEW_PROJECT, _identity(), permissions) is True

    def test_private_project_is_not_visible_without_role(self):
        permissions = _permissions()

        assert PermissionService.identity_can(Privilege.VIEW_PROJECT, _identity(), permissions) is False

    def test_admin_can_do_anything(self):
        permissions = _permissions()

        assert PermissionService.identity_can(Privilege.FULL_ACCESS, _identity(is_admin=True), permissions) is True


class TestGetPrivilegesForIdentityByPermissions:
    def test_group_editor_gets_edit_privilege(self):
        identity = _identity(group_ids=[GROUP])
        permissions = _permissions(groups={GROUP: Role.EDITOR})

        privileges = PermissionService.get_privileges_for_identity_by_permissions(identity, permissions)

        assert Privilege.EDIT_PROJECT in privileges
        assert Privilege.MANAGE_PROJECT not in privileges

    def test_public_project_grants_view_without_role(self):
        permissions = _permissions(visibility=Visibility.PUBLIC)

        privileges = PermissionService.get_privileges_for_identity_by_permissions(_identity(), permissions)

        assert privileges == PermissionService.PUBLIC_PROJECT_PRIVILEGES
