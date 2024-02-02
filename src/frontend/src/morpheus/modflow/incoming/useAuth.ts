import incomingUseAuthenticationHook, {IOAuthToken} from 'morpheus/authentication/outgoing/useAuthentication';

export interface IUseAuth {
  token: IOAuthToken;
  updateToken: (token: IOAuthToken) => void;
  onUnauthorized: () => void;
}

const useAuthenticationHook = () => ({...incomingUseAuthenticationHook()});

export default useAuthenticationHook;
