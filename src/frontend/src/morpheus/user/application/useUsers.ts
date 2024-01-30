import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {IError, IUser} from '../types';
import {useApi} from '../incoming';

import type {RootState} from 'morpheus/store';

import {setUsers, setError, setLoading} from '../infrastructure/store';

interface IUseUsers {
  fetchUsers: () => Promise<void>;
  users: IUser[];
  loading: boolean;
  error: IError | null;
}

type IUsersGetResponse = {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  is_superuser: boolean;
  status: 'active' | 'inactive'
}[];

const useUsers = (): IUseUsers => {

  const {httpGet} = useApi();

  const users = useSelector((state: RootState) => state.user.users);
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  const dispatch = useDispatch();

  const fetchUsers = async (): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    const result = await httpGet<IUsersGetResponse>('/users');
    if (result.ok) {
      dispatch(setUsers(result.val));
    }

    if (result.err) {
      dispatch(setError({
        message: result.val.message,
        code: result.val.code,
      }));
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    fetchUsers,
    users,
    loading,
    error,
  };
};

export default useUsers;

export type {IUser, IUseUsers};
