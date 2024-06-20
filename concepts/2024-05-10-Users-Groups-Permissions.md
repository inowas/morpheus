# Problem — The raw idea, a use case, or something we’ve seen that motivates us to work on this

**Permissions**

In Morpheus we have projects and we want to assign permissions for projects to users. Users can be part of a group. The
assignment of permissions to projects can also happen on group level. If a group as a permission to a project, all users
in that group have that permission.
We also want to assign permissions for groups to users.

In general permissions are expressed in form of roles. Permissions are managed in Morpheus. The single source of truth
for the permissions is Morpheus. We want to export permissions to Keycloak to be able to use them in other systems
(e.g. GeoNode).

**Users**

Users register and authenticate through Keycloak. We want to store and enhance the user data in Morpheus. The single
source of truth for users is Keycloak. We want to automatically import the user data from Keycloak to Morpheus.

**Groups**

Groups are created and managed in Morpheus. The single source of truth for groups is Morpheus. We want to export groups
to Keycloak to be able to use them in other systems (e.g. GeoNode).



# Appetite — How much time we want to spend and how that constrains the solution

We need this and want to spend 1 week on this.

# Solution — The core elements we came up with, presented in a form that’s easy for people to immediately understand

**Permissions**

The following roles for projects are available:
* Owner
* Admin
* Editor
* Viewer

The following roles for groups are available:
* Admin
* Member

The permission system in morpheus is eventsourced, i.e. we have events for every change in the permission system (
assigning users to projects, assigning groups to projects, assigning users to groups).

**Users**

Users authenticate with Keycloak in Morpheus. When they first login, a user is created in Morpheus. The
user is linked to the keycloak user via the keycloak user uuid.

```
┌────────────┐   first    ┌───────────┐
│  Keycloak  │   login    │ Morpheus  │
│            ├────────────►           │
│            │            │           │
└────▲───────┘            └─────┬─────┘
     │                          │  * user is created
     │                          │  * user is linked to keycloak
     │authenticates         ┌───▼───┐
     │                      │user db│
     │                      └───────┘
   ┌─┴──┐
   │User│
   └────┘
```

A user can also be linked to GeoNode.


**Groups**

Groups are created in Morpheus. A group has a name and a list of users per role (admins and members).
Groups in morhpeus are eventsourced, i.e. we have events for every change to groups (creating groups, deleting groups).

**Exporting to Keycloak**

Exporting permissions to Keycloak is done through the concept of groups in Keycloak. We create a project group for every
project. Every such project group has 4 subgroups for each role (Owners, Admins, Editors, Viewers). Groups in morpheus
are exported as work groups to Keycloak. Again, each work group has 2 subgroups for each role (Admins, Members).
The distinction between work groups and project groups is realized via attributes in Keycloak.
ALso work groups can be assigned to the project subgroups via attributes. The visibility of a project group is
also assigned via an attribute.

# Rabbit holes — Details about the solution worth calling out to avoid problems

The primary goal is to have users, groups and permissions in morpheus. We have users in keycloak and everything else in
morpheus. The export of groups and permissions to Keycloak and linking users to GeoNode is a nice to have feature for
easier synchronisation between the systems. But we will not spend too much time yet to implement this.


# No-gos — Anything specifically excluded from the concept: functionality or use cases we intentionally aren’t covering to fit the appetite or make the problem tractable

No automatic synchronisation between GeoNode and Morpheus.
