import {useAuthentication as incomingUseAuthenticationHook, IOAuthToken} from 'morpheus/authentication/outgoing';

export interface IUseAuthentication {
  token: IOAuthToken;
  updateToken: (token: IOAuthToken) => void;
  onUnauthorized: () => void;
}

const useAuthenticationHook = () => ({...incomingUseAuthenticationHook()});

export default useAuthenticationHook;
