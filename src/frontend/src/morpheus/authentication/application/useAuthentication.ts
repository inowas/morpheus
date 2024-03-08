import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '../../store';
import {IOAuthToken} from '../types';

interface IUseAuthentication {
  isAuthenticated: boolean;
  token: IOAuthToken | null;
  getUserInfo: () => Promise<any>;
  logout: () => Promise<void>;
}

const useAuthentication = (): IUseAuthentication => {

  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.authentication.token);
  const loading = useSelector((state: RootState) => state.authentication.loading);
  const error = useSelector((state: RootState) => state.authentication.error);


  return {
    isAuthenticated: null !== token,
    token: token,
    getUserInfo: () => Promise.resolve(),
    logout: () => Promise.resolve(),
  };
};

export default useAuthentication;
export type {IUseAuthentication};
