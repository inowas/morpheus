import {useAuthentication as useAuthenticationHook, IUseAuthentication as IUseAuthenticationHook} from 'morpheus/authentication/outgoing';


interface IUseAuthentication {
  accessToken: string;
  accessTokenObj: IUseAuthenticationHook['accessTokenObj'] | null;
  onUnauthorized: () => void;
}

const useAuthentication = (): IUseAuthentication => {
  const {accessTokenObj, accessToken, logout} = useAuthenticationHook();

  return {
    accessToken: accessToken,
    accessTokenObj: accessTokenObj,
    onUnauthorized: logout,
  };
};

export default useAuthentication;
export type {IUseAuthentication};
