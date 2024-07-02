import {useAuthenticatedUser as useAuthenticatedUserHook} from 'morpheus/user/outgoing';

interface IAuthenticatedUser {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  is_admin: boolean;
}

interface IUseAuthenticatedUser {
  authenticatedUser: IAuthenticatedUser | null;
}

const useAuthenticatedUser = () => {
  const {authenticatedUser} = useAuthenticatedUserHook();

  return {
    authenticatedUser: authenticatedUser && {
      user_id: authenticatedUser.user_id,
      username: authenticatedUser.username,
      email: authenticatedUser.email,
      full_name: `${authenticatedUser.first_name} ${authenticatedUser.last_name}`,
      is_admin: authenticatedUser.is_admin,
    } || null,
  };
};

export default useAuthenticatedUser;
export type {IUseAuthenticatedUser, IAuthenticatedUser};
