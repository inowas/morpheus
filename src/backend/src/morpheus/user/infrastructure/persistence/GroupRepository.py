import dataclasses
from typing import Mapping, Any
import pymongo

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.settings import settings as app_settings
from ...types.Group import Group, GroupId, GroupName
from ...types.User import UserId


@dataclasses.dataclass(frozen=True)
class GroupRepositoryDocument:
    group_id: str
    group_name: str
    members: list[str]
    admins: list[str]

    @classmethod
    def from_group(cls, group: Group):
        return cls(
            group_id=group.group_id.to_str(),
            group_name=group.group_name.to_str(),
            members=[member.to_str() for member in group.members],
            admins=[admin.to_str() for admin in group.admins]
        )

    @classmethod
    def from_raw_document(cls, raw_document: Mapping[str, Any]):
        return cls(
            group_id=raw_document['group_id'],
            group_name=raw_document['group_name'],
            members=raw_document['members'] if 'members' in raw_document else [],
            admins=raw_document['admins'] if 'admins' in raw_document else [],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_group(self) -> Group:
        return Group(
            group_id=GroupId.from_str(self.group_id),
            group_name=GroupName.from_str(self.group_name),
            members=set([UserId.from_str(member) for member in self.members]),
            admins=set([UserId.from_str(admin) for admin in self.admins]),
        )


class GroupRepository(RepositoryBase):
    def add_group(self, group: Group) -> None:
        self.collection.insert_one(GroupRepositoryDocument.from_group(group).to_dict())

    def add_member_to_group(self, group_id: GroupId, member: UserId) -> None:
        self.collection.update_one(
            filter={'group_id': group_id.to_str()},
            update={'$addToSet': {'members': member.to_str()}}
        )

    def remove_member_from_group(self, group_id: GroupId, member: UserId) -> None:
        self.collection.update_one(
            filter={'group_id': group_id.to_str()},
            update={'$pull': {'members': member.to_str()}}
        )

    def add_admin_to_group(self, group_id: GroupId, admin: UserId) -> None:
        self.collection.update_one(
            filter={'group_id': group_id.to_str()},
            update={'$addToSet': {'admins': admin.to_str()}}
        )

    def remove_admin_from_group(self, group_id: GroupId, admin: UserId) -> None:
        self.collection.update_one(
            filter={'group_id': group_id.to_str()},
            update={'$pull': {'admins': admin.to_str()}}
        )

    def find_all_groups(self) -> list[Group]:
        return [GroupRepositoryDocument.from_raw_document(raw_document).get_group() for raw_document in self.collection.find()]

    def find_group_by_id(self, group_id: GroupId) -> Group | None:
        raw_document = self.collection.find_one({'group_id': group_id.to_str()})
        if raw_document is None:
            return None

        return GroupRepositoryDocument.from_raw_document(raw_document).get_group()


def __create_indices_for_repository(collection: pymongo.collection.Collection):
    collection.create_index(
        [
            ('group_id', pymongo.ASCENDING),
        ],
        unique=True,
    )


group_repository = GroupRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_USER_DATABASE, create_if_not_exist=True),
        'groups',
        __create_indices_for_repository
    )
)
