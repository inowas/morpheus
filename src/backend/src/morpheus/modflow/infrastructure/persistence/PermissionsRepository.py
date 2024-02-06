import dataclasses
from typing import Literal

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.settings import settings as app_settings

from ...types.Project import ProjectId
from ...types.Permissions import Permissions, GroupCollection, MemberCollection, Visibility, Role
from ...types.User import UserId


@dataclasses.dataclass(frozen=True)
class PermissionsRepositoryDocument:
    project_id: str
    owner_id: str
    groups: dict
    members: dict
    visibility: Literal["public", "private"]

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            owner_id=obj['owner_id'],
            groups=obj['groups'],
            members=obj['members'],
            visibility=obj['visibility'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.project_id)

    def get_owner(self) -> UserId:
        return UserId.from_str(self.owner_id)

    def get_groups(self) -> GroupCollection:
        return GroupCollection.from_dict(self.groups)

    def get_members(self) -> MemberCollection:
        return MemberCollection.from_dict(self.members)

    def get_visibility(self) -> Visibility:
        return Visibility(self.visibility)


class PermissionsRepository(RepositoryBase):
    def has_permissions(self, project_id: ProjectId) -> bool:
        return self.collection.find_one({'project_id': project_id.to_str()}) is not None

    def get_owner(self, project_id: ProjectId) -> UserId | None:
        data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if data is None:
            return None

        return PermissionsRepositoryDocument.from_dict(dict(data)).get_owner()

    def get_groups(self, project_id: ProjectId) -> GroupCollection | None:
        data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if data is None:
            return None

        return PermissionsRepositoryDocument.from_dict(dict(data)).get_groups()

    def get_members(self, project_id: ProjectId) -> MemberCollection | None:
        data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if data is None:
            return None

        return PermissionsRepositoryDocument.from_dict(dict(data)).get_members()

    def get_visibility(self, project_id: ProjectId) -> Visibility | None:
        data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if data is None:
            return None

        return PermissionsRepositoryDocument.from_dict(dict(data)).get_visibility()

    def get_permissions(self, project_id: ProjectId) -> Permissions | None:
        data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if data is None:
            return None

        document = PermissionsRepositoryDocument.from_dict(dict(data))
        return Permissions(
            owner_id=document.get_owner(),
            groups=document.get_groups(),
            members=document.get_members(),
            visibility=document.get_visibility(),
        )

    def save_permissions(self, project_id: ProjectId, permissions: Permissions) -> None:
        if self.has_permissions(project_id):
            raise Exception(f'Permissions already exist for project {project_id.to_str()}')

        self.collection.insert_one(PermissionsRepositoryDocument(
            project_id=project_id.to_str(),
            owner_id=permissions.owner_id.to_str(),
            groups=permissions.groups.to_dict(),
            members=permissions.members.to_dict(),
            visibility=permissions.visibility.to_str(),
        ).to_dict())

    def update_ownership(self, project_id: ProjectId, user_id: UserId) -> None:
        if not self.has_permissions(project_id):
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        document = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if document is None:
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        self.collection.update_one(
            filter={'project_id': project_id.to_str()},
            update={'$set': {'owner': user_id.to_str()}}
        )

    def update_groups(self, project_id: ProjectId, groups: GroupCollection) -> None:
        if not self.has_permissions(project_id):
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        document = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if document is None:
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        self.collection.update_one(
            filter={'project_id': project_id.to_str()},
            update={'$set': {'groups': groups.to_dict()}}
        )

    def add_member(self, project_id: ProjectId, user_id: UserId, role: Role) -> None:

        if not self.has_permissions(project_id):
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        document = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if document is None:
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        members = MemberCollection.from_dict(document['members'])
        members = members.with_added_member(user_id=user_id, role=role)

        self.collection.update_one(
            filter={'project_id': project_id.to_str()},
            update={'$set': {'members': members.to_dict()}}
        )

    def remove_member(self, project_id: ProjectId, user_id: UserId) -> None:
        if not self.has_permissions(project_id):
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        document = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if document is None:
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        members = MemberCollection.from_dict(document['members'])
        members = members.with_removed_member(user_id=user_id)

        self.collection.update_one(
            filter={'project_id': project_id.to_str()},
            update={'$set': {'members': members.to_dict()}}
        )

    def update_member(self, project_id: ProjectId, user_id: UserId, role: Role) -> None:
        if not self.has_permissions(project_id):
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        document = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if document is None:
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        members = MemberCollection.from_dict(document['members'])
        members = members.with_updated_member(user_id=user_id, role=role)

        self.collection.update_one(
            filter={'project_id': project_id.to_str()},
            update={'$set': {'members': members.to_dict()}}
        )

    def update_members(self, project_id: ProjectId, members: MemberCollection) -> None:
        if not self.has_permissions(project_id):
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        document = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if document is None:
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        self.collection.update_one(
            filter={'project_id': project_id.to_str()},
            update={'$set': {'members': members.to_dict()}}
        )

    def update_visibility(self, project_id: ProjectId, visibility: Visibility) -> None:
        if not self.has_permissions(project_id):
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        document = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if document is None:
            raise Exception(f'Permissions do not exist for project {project_id.to_str()}')

        self.collection.update_one(
            filter={'project_id': project_id.to_str()},
            update={'$set': {'visibility': visibility.to_str()}}
        )


permissions_repository = PermissionsRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'permissions_projection'
    )
)
