import React, {useEffect, useState} from 'react';

import {DataRow, Form, InfoTitle, Label, Message, SectionTitle} from 'common/components';
import useGroups from '../../application/useGroups';
import useProjectPermissions from '../../application/useProjectPermissions';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import useProjectGroupRole from '../../application/useProjectGroupRole';

type IProjectRole = 'viewer' | 'editor' | 'admin';

interface IProps {
  projectId: string;
}

const roleOptions = [
  {key: 'none', value: '', text: 'No access'},
  {key: 'viewer', value: 'viewer', text: 'Viewer'},
  {key: 'editor', value: 'editor', text: 'Editor'},
  {key: 'admin', value: 'admin', text: 'Admin'},
];

const ProjectPermissionsContainer = ({projectId}: IProps) => {
  const {groups} = useGroups();
  const {permissions} = useProjectPermissions(projectId);
  const {privileges} = useProjectPrivileges(projectId);
  const {setGroupRole} = useProjectGroupRole();

  const [roles, setRoles] = useState<Record<string, string>>({});

  const canManage = !!privileges?.includes('manage_project');

  useEffect(() => {
    if (permissions) {
      setRoles(permissions.groups as Record<string, string>);
    }
  }, [permissions]);

  const handleRoleChange = (groupId: string, role: string) => {
    setRoles((previous) => ({...previous, [groupId]: role}));
    setGroupRole(projectId, groupId, '' === role ? null : (role as IProjectRole));
  };

  const sortedGroups = [...groups].sort((a, b) => a.group_name.localeCompare(b.group_name));

  return (
    <>
      <SectionTitle
        as={'h4'}
        title={'Group access'}
        style={{marginBottom: 10}}
      />
      <InfoTitle
        title={'Shared with groups'}
        description={'Members of a group inherit the assigned role on this project.'}
      />
      <DataRow>
        {0 === sortedGroups.length && (
          <Message info content={'No groups available yet.'}/>
        )}
        {sortedGroups.map((group) => (
          <DataRow key={group.group_id} style={{alignItems: 'center', gap: 10}}>
            <Label content={group.group_name} style={{minWidth: 180}}/>
            <Form.Dropdown
              value={roles[group.group_id] || ''}
              options={roleOptions}
              selection
              disabled={!canManage}
              style={{minWidth: 140}}
              onChange={(event, data) => handleRoleChange(group.group_id, String(data.value))}
            />
          </DataRow>
        ))}
      </DataRow>
    </>
  );
};

export default ProjectPermissionsContainer;
