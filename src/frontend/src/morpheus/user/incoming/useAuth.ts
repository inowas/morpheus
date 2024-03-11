import incomingUseAuthenticationHook from 'morpheus/authentication/application/useAuthentication';

export interface IUseAuth {
  token: string;
  onUnauthorized: () => void;
}

const useAuthenticationHook = () => ({...incomingUseAuthenticationHook()});

export default useAuthenticationHook;
