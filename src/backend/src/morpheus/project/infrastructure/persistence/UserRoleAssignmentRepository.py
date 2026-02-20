import dataclasses
from collections.abc import Mapping
from typing import Any

import pymongo

from morpheus.common.infrastructure.persistence.mongodb import RepositoryBase, create_or_get_collection, get_database_client
from morpheus.common.types.identity.Identity import UserId
from morpheus.settings import settings as app_settings

from ...types.Permissions import Role
from ...types.permissions.UserRoleAssignment import UserRoleAssignment
from ...types.permissions.UserRoleAssignmentCollection import UserRoleAssignmentCollection
from ...types.Project import ProjectId


@dataclasses.dataclass(frozen=True)
class UserRoleAssignmentRepositoryDocument:
    project_id: str
    user_id: str
    role: str

    @classmethod
    def from_raw_document(cls, raw_document: Mapping[str, Any]):
        return cls(
            project_id=raw_document['project_id'],
            user_id=raw_document['user_id'],
            role=raw_document['role'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_user_role_assignment(self) -> UserRoleAssignment:
        return UserRoleAssignment(
            project_id=ProjectId.from_str(self.project_id),
            user_id=UserId.from_str(self.user_id),
            role=Role.from_str(self.role),
        )


class UserRoleAssignmentRepository(RepositoryBase):
    def add_role_for_member(self, project_id: ProjectId, user_id: UserId, role: Role) -> None:
        self.collection.insert_one(
            UserRoleAssignmentRepositoryDocument(
                project_id=project_id.to_str(),
                user_id=user_id.to_str(),
                role=role.to_str(),
            ).to_dict()
        )

    def remove_all_roles_for_member(self, project_id: ProjectId, user_id: UserId) -> None:
        self.collection.delete_many(
            {
                'project_id': project_id.to_str(),
                'user_id': user_id.to_str(),
            }
        )

    def update_member_role(self, project_id: ProjectId, user_id: UserId, new_role: Role) -> None:
        self.collection.update_one(
            {
                'project_id': project_id.to_str(),
                'user_id': user_id.to_str(),
            },
            {'$set': {'role': new_role.to_str()}},
        )

    def find_role_assignments_for_user_having_roles(self, user_id: UserId, roles: list[Role]) -> UserRoleAssignmentCollection:
        documents = self.collection.find({'user_id': user_id.to_str(), 'role': {'$in': [role.to_str() for role in roles]}})

        collection = UserRoleAssignmentCollection.empty(user_id)
        for document in documents:
            collection.add_role_assignment(UserRoleAssignmentRepositoryDocument.from_raw_document(document).get_user_role_assignment())
        return collection

    def find_role_assignment(self, project_id: ProjectId, user_id: UserId) -> UserRoleAssignment | None:
        document = self.collection.find_one(
            {
                'project_id': project_id.to_str(),
                'user_id': user_id.to_str(),
            }
        )
        if not document:
            return None

        return UserRoleAssignmentRepositoryDocument.from_raw_document(document).get_user_role_assignment()


user_role_assignment_repository = UserRoleAssignmentRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'user_role_assignments',
        lambda collection: collection.create_index(
            [
                ('project_id', pymongo.ASCENDING),
                ('user_id', pymongo.ASCENDING),
            ],
            unique=True,
        ),
    )
)
