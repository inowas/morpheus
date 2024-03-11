import {useAuthentication as incomingUseAuthenticationHook} from 'morpheus/authentication/outgoing';

export interface IUseAuthentication {
  token: string;
  onUnauthorized: () => void;
}

const useAuthenticationHook = () => ({...incomingUseAuthenticationHook()});

export default useAuthenticationHook;
