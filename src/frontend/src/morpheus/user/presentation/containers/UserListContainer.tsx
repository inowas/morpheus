import React from 'react';
import {IUser} from '../../types';
import {useUsers} from '../../application';

const UserListContainer = () => {

  const {users, loading, error} = useUsers();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error...</div>;
  }

  return (
    <>
      <h1>Users</h1>
      <div>
        {users.map((user: IUser) => <div key={user.user_id}>{user.username}</div>)}
      </div>
    </>
  );
};

export default UserListContainer;
