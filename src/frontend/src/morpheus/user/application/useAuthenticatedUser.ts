import {IAuthenticatedUser, IError} from '../types';
import {setAuthenticatedUser, setError, setLoading} from '../infrastructure/store';
import {useDispatch, useSelector} from 'react-redux';

import type {IRootState} from 'morpheus/store';
import {useApi} from '../incoming';
import {useEffect} from 'react';


interface IUseAuthenticatedUser {
  authenticatedUser: IAuthenticatedUser | null;
  loading: boolean;
  error: IError | null;
}

type IAuthenticatedUserGetResponse = {
  user_id: string;
  is_admin: boolean;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  keycloak_user_id: string;
  geo_node_user_id: string;
};

const useAuthenticatedUser = (): IUseAuthenticatedUser => {

  const {httpGet} = useApi();

  const authenticatedUser = useSelector((state: IRootState) => state.user.authenticatedUser);
  const loading = useSelector((state: IRootState) => state.user.loading);
  const error = useSelector((state: IRootState) => state.user.error);

  const dispatch = useDispatch();

  const fetchAuthenticatedUser = async (): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    const result = await httpGet<IAuthenticatedUserGetResponse>('/users/me');
    if (result.ok) {
      dispatch(setAuthenticatedUser(result.val));
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
    fetchAuthenticatedUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    authenticatedUser,
    loading,
    error,
  };
};

export default useAuthenticatedUser;

export type {IUseAuthenticatedUser};
