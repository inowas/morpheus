import {IError, IUser} from '../types';
import {setError, setLoading, setUsers} from '../infrastructure/store';
import {useDispatch, useSelector} from 'react-redux';

import type {IRootState} from 'morpheus/store';
import {useApi} from '../incoming';
import {useEffect} from 'react';

interface IUseUsers {
  users: IUser[];
  loading: boolean;
  error: IError | null;
}

type IUsersGetResponse = {
  user_id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
}[];

const useUsers = (): IUseUsers => {

  const {httpGet} = useApi();

  const users = useSelector((state: IRootState) => state.user.users);
  const loading = useSelector((state: IRootState) => state.user.loading);
  const error = useSelector((state: IRootState) => state.user.error);

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
    users,
    loading,
    error,
  };
};

export default useUsers;

export type {IUser, IUseUsers};
