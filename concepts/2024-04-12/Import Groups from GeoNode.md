# Problem — The raw idea, a use case, or something we’ve seen that motivates us to work on this

In Morpheus we want to be able to have groups of users. This helps us in managing permissions for projects.
In GeoNode exists the possibility to create and manage groups. Our users for Morpheus and GeoNode authenticate using
our Keycloak identity provider.

As the users are the same (identified by Keaycloak uuid) in Morpheus and GeoNode we can use the groups from GeoNode
in Morpheus. Our idea is to import the groups manually from GeoNode into Morpheus by using the GeoNode API.


# Appetite — How much time we want to spend and how that constrains the solution

We want to evaluate the possibility of it and then implement the import if possible. We want to spend up to 2-3
days on this in total. We want to look for another solution if we find out it is not possible.

# Solution — The core elements we came up with, presented in a form that’s easy for people to immediately understand

There are several things we must ensure that the idea is possible and that we can implement it:
* we must ensure users authenticate with Keycloak in GeoNode
* we must be able to identitfy the users returned by GeoNode API in Morpheus (ideally we get the Keycloak uuid of the user)

The import of groups will be implemented in the Morpheus backend. It will consist of two steps:

1. List groups available in GeoNode
   * We add an endpoint (GET /users/groups/available-for-import) to list groups from GeoNode. The groups will be fetched
     from the GeoNode api (https://docs.geonode.org/en/master/devel/api/V2/index.html#get--api-v2-groups-).
2. Import the groups into Morpheus
    * We add an endpoint (POST /users/groups) to import the groups from GeoNode into Morpheus. The group to create is
      identified by the id from GeoNode. The users of the group will be fetched from the GeoNode api and the groups will
      be stored in the Morpheus database in the users module.


# Rabbit holes — Details about the solution worth calling out to avoid problems

We can try to convince the users of GeoNode to authenticate and register with Keycloak by adding texts to the GeoNode
login page or hiding the normal login page. This requires theming GeoNode. See
https://docs.geonode.org/en/master/basic/theme/index.html and our GeoNode repo at
https://gitlab.junghanns.it/inowas/datahub. This might be a lot of effort though.

# No-gos — Anything specifically excluded from the concept: functionality or use cases we intentionally aren’t covering to fit the appetite or make the problem tractable

- We are not synchronizing the groups between the systems (there will be only be an import from GeoNode to Morpheus).
- We will only trigger the import manually, there will be no automatic import.
- We will live with the possibility of the groups being out of sync between the systems.
