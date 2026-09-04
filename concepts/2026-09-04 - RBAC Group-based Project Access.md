# Problem — The raw idea, a use case, or something we’ve seen that motivates us to work on this

Morpheus already has a partial RBAC and the "group" half of it is dead code:

**What already exists (working)**
- Per-project member roles: `Role` enum `owner/admin/editor/viewer` (`project/types/Permissions.py`),
  assigned per user via `update_project_member_role_command` → `PermissionsProjector` /
  `UserRoleAssignmentProjector`.
- Privilege ladder: `Privilege` (`full_access`, `manage_project`, `edit_project`, `view_project`)
  mapped to roles in `PermissionService.PRIVILEGE_ROLE_MAP` (`project/domain/PermissionService.py:24`).
  Handlers enforce via `permissions_reader.assert_identity_can(privilege, identity, project_id)`
  (`project/application/read/PermissionsReader.py:19`).
- Global super-admin: `is_admin` boolean sourced from one Keycloak realm role, short-circuits all checks.
- Identity: `user_id`, `group_ids`, `is_admin` (`common/types/identity/Identity.py`).

**The gaps (the unimplemented RBAC)**
1. `group_ids` is always `[]` — hardcoded in `get_identity_by_keycloak_id`
   (`user/outgoing/__init__.py:38`), even though the `Group` domain (create/add members/admins) is fully built.
2. `Permissions.groups` (`{GroupId: Role}`) is dead — never written: `PermissionsRepository.update_groups`
   has zero callers, no command assigns a group a role on a project.
3. Group roles are never enforced — `PermissionService.identity_can()` and
   `get_privileges_for_identity_by_permissions()` only check `permissions.members`; they never look at
   `permissions.groups` or `identity.group_ids`.
4. No frontend for groups or group-role assignment.

# Appetite — How much time we want to spend and how that constrains the solution

Backend only. Frontend management UI and Keycloak export are explicitly out of scope for this pass.

Syntax: `RBAC Group-based Project Access`. Scope approved: per-project roles (existing); groups grant
owner/admin/editor/viewer on a project; membership inherits through groups.

# Solution — The core elements we came up with, presented in a form that’s easy for people to immediately understand

Decision: keep per-project authorization in the application, not in Keycloak. Per-project roles are
resource-scoped ("user X is editor on project Y") — application data, not identity. Keycloak is used only
for authentication and *global* app roles (the existing `is_admin` via `realm_access.roles`). Keycloak
Organizations are out of scope: org roles are too coarse and would create a second source of truth for
group membership; the app already has the Group domain.

1. **Populate `Identity.group_ids`** (currently `[]` at `user/outgoing/__init__.py:38`)
   - Add `GroupReader.get_groups_for_user(user_id) -> list[GroupId]` (GroupReader has `get_group`, `get_all_groups`).
   - Use it in `get_identity_by_keycloak_id` so `authenticate_token` stamps group memberships on every identity.

2. **Assign group roles to projects (write path)**
   - New `UpdateProjectGroupRoleCommand` (grant/revoke a `Role` to a `GroupId` on a project), mirroring
     `Project/UpdateProjectMemberRole.py`.
   - New event + `PermissionsProjector` handler writing `Permissions.groups` — this finally uses the dead
     `PermissionsRepository.update_groups` and `Permissions.with_updated_groups`.
   - Register the command in the message box registry + `schema.yml`, gated by `MANAGE_PROJECT`
     (admin/owner) via `assert_identity_can`.

3. **Enforce group roles (check path)**
   - In `PermissionService` (`PermissionService.py:99`), resolve the user's *effective* role: explicit member
     role if present, else the best (highest) role among `Permissions.groups ∩ Identity.group_ids`, else
     public/deny. Member role wins as more specific.
   - Mirror in `get_privileges_for_identity_by_permissions` (`PermissionService.py:83`) so the privileges
     API matches enforcement.
   - Add a `Role` ordering helper (viewer < editor < admin < owner) rather than hardcoding chains.

4. **Tests** (pytest, patterns like `test_project_commands.py` / `test_keycloak_parser.py`)
   - Group→project role assignment command.
   - `PermissionService` effective-role resolution (member-vs-group, public fallback, admin/owner short-circuit).
   - `group_ids` population in identity.

# Rabbit holes — Details about the solution worth calling out to avoid problems

- Effective-role precedence: explicit member role > group roles > public-view/deny. Document this, don't let
  it grow options.
- `Permissions.groups` keyed by `GroupId`; enforce via the intersection with `Identity.group_ids` — group
  membership must be resolved from Morpheus' own Group store, not from Keycloak.
- Global admin (`is_admin`) and project owner keep short-circuiting group checks, as they do for members today.

# No-gos — Anything specifically excluded from the concept: functionality or use cases we intentionally aren’t covering to fit the appetite or make the problem tractable

- Frontend group/roles management UI.
- Keycloak Organizations / exporting groups or permissions to Keycloak (see existing concept
  `2024-05-10 - Users-Groups-Permissions.md` for that direction).
- More global (realm-role) roles beyond the existing `is_admin`.
