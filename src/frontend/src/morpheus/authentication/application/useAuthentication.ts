import {useAuth} from 'react-oidc-context';
import {IUserProfile} from '../types';

interface IUseAuthentication {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: IOAuthToken | null;
  signOutLocally: () => Promise<void>;
  signOutSilent: () => Promise<void>;
  signIn: () => Promise<void>;
  userProfile?: IUserProfile;
  error?: Error;
}

interface IOAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  user_id: string;
}

const useAuthentication = (): IUseAuthentication => {

  const auth = useAuth();

  const signIn = async () => {
    await auth.signinRedirect();
  };

  const signOutLocally = async () => {
    await auth.removeUser();
  };

  const getAccessToken = (): IOAuthToken | null => {

    if (!auth.user) {
      return null;
    }

    return {
      access_token: auth.user.access_token,
      expires_in: auth.user.expires_in || 0,
      token_type: auth.user.token_type,
      scope: auth.user.scope || '',
      refresh_token: auth.user.refresh_token || '',
      user_id: auth.user.profile.sub,
    };
  };


  return {
    accessToken: getAccessToken(),
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading || auth.activeNavigator !== undefined,
    signIn,
    signOutLocally,
    signOutSilent: auth.signoutSilent,
    userProfile: auth.user?.profile as IUserProfile | undefined,
  };
};

export default useAuthentication;
export type {IUseAuthentication};
