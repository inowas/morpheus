from morpheus.user.application.read.GroupReader import group_reader
from morpheus.user.incoming import get_identity


class ReadGroupListRequestHandler:
    @staticmethod
    def handle():
        identity = get_identity()
        if identity is None:
            return '', 401

        if not identity.is_admin:
            return '', 403

        groups = group_reader.get_all_groups()

        result = []
        for group in groups:
            result.append({
                'group_id': group.group_id.to_str(),
                'group_name': group.group_name.to_str(),
                'members': [member.to_str() for member in group.members],
                'admins': [admin.to_str() for admin in group.admins],
            })

        return result, 200
