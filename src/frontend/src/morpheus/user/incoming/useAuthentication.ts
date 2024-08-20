import {useAuthentication as useAuthenticationHook, IUseAuthentication as IUseAuthenticationHook} from 'morpheus/authentication/outgoing';


interface IUseAuthentication {
  accessToken: IUseAuthenticationHook['accessTokenObj'] | null;
  onUnauthorized: () => void;
  userProfile: {
    email: string;
    name: string;
  };
}

const useAuthentication = () => {
  const {accessToken, logout, userProfile} = useAuthenticationHook();

  return {
    accessToken: accessToken,
    onUnauthorized: logout,
    userProfile,
  };
};

export default useAuthentication;
export type {IUseAuthentication};
