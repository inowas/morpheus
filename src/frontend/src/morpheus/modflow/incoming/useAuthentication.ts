import {useAuthentication as useAuthenticationHook, IUseAuthentication as IUseAuthenticationHook} from 'morpheus/authentication/outgoing';


interface IUseAuthentication {
  accessToken: IUseAuthenticationHook['accessToken'] | null;
  onUnauthorized: () => void;
  userProfile: {
    email: string;
    name: string;
  };
}

const useAuthentication = () => {
  const {accessToken, signOutLocally, userProfile} = useAuthenticationHook();

  return {
    accessToken,
    onUnauthorized: signOutLocally,
    userProfile,
  };
};

export default useAuthentication;
export type {IUseAuthentication};
