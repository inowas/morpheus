import {useUsers as useUsersHook, IUser as IUserModuleUser, IAuthenticatedUser as IUserModuleAuthenticatedUser} from 'morpheus/user/outgoing';
import {useAuthenticatedUser as useAuthenticatedUserHook} from 'morpheus/user/outgoing';

interface IUser {
  user_id: string;
  username: string;
  full_name: string;
}

interface IAuthenticatedUser {
  user_id: string;
  is_admin: boolean;
  email: string;
  username: string;
  full_name: string;
  keycloak_user_id: string | null;
  geo_node_user_id: string | null;
}

interface IUseUsers {
  authenticatedUser: IUser | null;
  users: IUser[];
}

const mapUser = (user: IUserModuleUser): IUser => ({
  user_id: user.user_id,
  username: user.username,
  full_name: `${user.first_name} ${user.last_name}`,
});

const mapAuthenticatedUser = (user: IUserModuleAuthenticatedUser): IAuthenticatedUser => ({
  user_id: user.user_id,
  is_admin: user.is_admin,
  email: user.email,
  username: user.username,
  full_name: `${user.first_name} ${user.last_name}`,
  keycloak_user_id: user.keycloak_user_id,
  geo_node_user_id: user.geo_node_user_id,
});

const useUsers = (): IUseUsers => {
  const {authenticatedUser} = useAuthenticatedUserHook();
  const {users} = useUsersHook();

  return {
    authenticatedUser: authenticatedUser ? mapAuthenticatedUser(authenticatedUser) : null,
    users: users.map(mapUser),
  };
};

export default useUsers;
export type {IUseUsers, IUser, IAuthenticatedUser};
