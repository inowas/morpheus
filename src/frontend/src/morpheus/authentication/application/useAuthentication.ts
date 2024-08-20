import {useOidc, useOidcAccessToken, useOidcIdToken, useOidcUser} from '@axa-fr/react-oidc';

type IAccessToken = string;

interface IAccessTokenPayload {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: 'Bearer';
  azp: string;
  sid: string;
}

type IIdToken = string;

interface IIdTokenPayload {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: 'ID';
  azp: string;
  nonce: string;
  sid: string;
}

interface IOdcUserOInfo {
  sub: string;
  email_verified?: boolean;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
}

type IOidcUserState = 'Unauthenticated' | 'Loading' | 'Loaded' | 'LoadingError';

interface IUseAuthentication {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessTokenObj: IOAuthToken | null;
  accessToken: string;
  renewTokens: () => void;
  login: () => void;
  logout: () => void;
  userProfile?: IOdcUserOInfo;
  error?: Error;
}

interface IOAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  user_id: string;
}

const useAuthentication = (): IUseAuthentication => {

  const {logout, isAuthenticated, login, renewTokens} = useOidc();
  const {accessToken, accessTokenPayload} = useOidcAccessToken();
  const typedAccessToken: IAccessToken = accessToken;
  const typedAccessTokenPayload: IAccessTokenPayload = accessTokenPayload;

  const {idToken, idTokenPayload} = useOidcIdToken();
  const typedIdToken: IIdToken = idToken;
  const typedIdTokenPayload: IIdTokenPayload = idTokenPayload;

  const {oidcUser, oidcUserLoadingState, reloadOidcUser} = useOidcUser();
  const typedOidcUser: IOdcUserOInfo = oidcUser;
  const typedOidcUserLoadingState: IOidcUserState = oidcUserLoadingState as unknown as IOidcUserState;

  const getAccessToken = (): IOAuthToken | null => {

    if (!oidcUser || !accessToken) {
      return null;
    }

    return {
      access_token: typedAccessToken,
      expires_in: typedAccessTokenPayload.exp,
      token_type: typedAccessTokenPayload.typ,
      scope: typedAccessTokenPayload.aud,
      user_id: typedOidcUser.sub,
    };
  };


  return {
    accessTokenObj: getAccessToken(),
    accessToken: typedAccessToken,
    isAuthenticated: isAuthenticated,
    isLoading: 'Loading' === typedOidcUserLoadingState,
    login: login,
    logout: logout,
    renewTokens: renewTokens,
    userProfile: oidcUser,
    error: undefined,
  };
};

export default useAuthentication;
export type {IUseAuthentication};
