import React, {useState} from 'react';
import {Navigate} from 'react-router-dom';
import {Form, Header} from 'semantic-ui-react';

import {Button, ContentWrapper, DataRow, Label, Loader, Message, SectionTitle} from 'common/components';
import useGroupManagement from '../../application/useGroupManagement';
import useGroups, {IGroup} from '../../application/useGroups';
import useUsers from '../../incoming/useUsers';

const GroupManagementContainer = () => {
  const {groups, loading, reload} = useGroups();
  const {users, authenticatedUser} = useUsers();
  const {createGroup, addGroupMembers} = useGroupManagement();

  const [newGroupName, setNewGroupName] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [memberSelections, setMemberSelections] = useState<Record<string, string[]>>({});

  if (!authenticatedUser) {
    return <Loader active inline="centered" content="Loading..."/>;
  }

  if (!authenticatedUser.is_admin) {
    return <Navigate to="/projects" replace={true}/>;
  }

  const handleCreateGroup = async () => {
    const name = newGroupName.trim();
    if (!name) {
      return;
    }

    setFeedback(null);
    const ok = await createGroup(name);
    if (ok) {
      setNewGroupName('');
      setFeedback('Group created.');
      await reload();
    } else {
      setFeedback('Could not create group.');
    }
  };

  const handleAddMembers = async (group: IGroup) => {
    const memberIds = memberSelections[group.group_id] || [];
    if (0 === memberIds.length) {
      return;
    }

    setFeedback(null);
    const ok = await addGroupMembers(group.group_id, memberIds);
    if (ok) {
      setMemberSelections((previous) => ({...previous, [group.group_id]: []}));
      setFeedback('Members added.');
      await reload();
    } else {
      setFeedback('Could not add members.');
    }
  };

  const userOptions = users
    .map((user) => ({
      key: user.user_id,
      value: user.user_id,
      text: user.full_name || user.username,
    }));

  const memberOptionsFor = (group: IGroup) => userOptions.filter((option) => !group.members.includes(option.value));

  return (
    <ContentWrapper>
      <Header as="h2">Group management</Header>

      <SectionTitle
        as="h4"
        title="Create group"
        style={{marginBottom: 10}}
      />
      <Form>
        <Form.Group inline>
          <Form.Input
            placeholder="Group name"
            value={newGroupName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewGroupName(event.target.value)}
          />
          <Button primary content={'Create'} onClick={() => handleCreateGroup()}/>
        </Form.Group>
      </Form>

      {feedback && <Message info content={feedback}/>}

      <SectionTitle
        as="h4"
        title="Groups"
        style={{marginBottom: 10}}
      />
      {loading && <Loader active inline="centered" content="Loading..."/>}
      {!loading && 0 === groups.length && <Message info content={'No groups yet.'}/>}

      {groups.map((group) => (
        <DataRow key={group.group_id} style={{alignItems: 'center', gap: 10}}>
          <Label content={group.group_name} style={{minWidth: 160}}/>
          <span>{group.members.length} members</span>
          <Form.Dropdown
            multiple
            selection
            search
            placeholder="Add members"
            value={memberSelections[group.group_id] || []}
            options={memberOptionsFor(group)}
            style={{minWidth: 220}}
            onChange={(event, data) => setMemberSelections((previous) => ({...previous, [group.group_id]: data.value as string[]}))}
          />
          <Button
            size="tiny"
            content={'Add'}
            onClick={() => handleAddMembers(group)}
          />
        </DataRow>
      ))}
    </ContentWrapper>
  );
};

export default GroupManagementContainer;
