import {useAuthentication as useAuthenticationHook, IUseAuthentication as IUseAuthenticationHook} from 'morpheus/authentication/outgoing';


interface IUseAuthentication {
  accessToken: IUseAuthenticationHook['accessToken'] | null;
  onUnauthorized: () => void;
}

const useAuthentication = (): IUseAuthentication => {
  const {accessToken, signOutLocally} = useAuthenticationHook();

  return {
    accessToken,
    onUnauthorized: signOutLocally,
  };
};

export default useAuthentication;
export type {IUseAuthentication};
