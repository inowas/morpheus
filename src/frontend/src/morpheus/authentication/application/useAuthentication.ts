import {useAuth} from 'react-oidc-context';
import {IUserProfile} from '../types';

interface IUseAuthentication {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  signOut: () => Promise<void>;
  signIn: () => Promise<void>;
  userProfile?: IUserProfile;
  error?: Error;
}

const useAuthentication = (): IUseAuthentication => {

  const auth = useAuth();

  const signIn = async () => {
    await auth.signinRedirect();
  };

  const signOut = async () => {
    auth.removeUser();
    auth.signoutRedirect();
  };


  return {
    accessToken: auth.user?.access_token || null,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading || auth.activeNavigator !== undefined,
    signIn: signIn,
    signOut: signOut,
    userProfile: auth.user?.profile as IUserProfile | undefined,
  };
};

export default useAuthentication;
export type {IUseAuthentication};
